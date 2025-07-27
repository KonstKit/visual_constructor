import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Schema } from '../types/api';

interface Props {
  schema: Schema;
  width?: number;
  height?: number;
  onTableSelect?: (table: string) => void;
}

type TablePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function SchemaVisualizer({ schema, width = 800, height = 600, onTableSelect }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const minimapRef = useRef<SVGSVGElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ table: string; x: number; y: number } | null>(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g').attr('class', 'container');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      container.attr('transform', event.transform);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoomBehavior as any);
    svg.call(zoomBehavior.transform, transform);

    const tableWidth = 150;
    const rowHeight = 20;
    const margin = 40;
    const positions = new Map<string, TablePosition>();

    const visibleTables = schema.tables.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );

    const tableGroups = container
      .selectAll('g.table')
      .data(visibleTables)
      .enter()
      .append('g')
      .attr('class', 'table')
      .attr('transform', (d, i) => {
        const x = (i % 3) * (tableWidth + margin);
        const y = Math.floor(i / 3) * (150 + margin);
        const collapsedHeight = rowHeight;
        const fullHeight = rowHeight * (d.columns.length + 1);
        const height = collapsed.has(d.name) ? collapsedHeight : fullHeight;
        positions.set(d.name, { x, y, width: tableWidth, height });
        return `translate(${x},${y})`;
      })
      .attr('draggable', true)
      .on('dragstart', (event, d) => {
        event.dataTransfer?.setData('text/plain', d.name);
      })
      .on('click', (_event, d) => {
        setSelected((prev) => (prev === d.name ? null : d.name));
        onTableSelect?.(d.name);
      })
      .on('dblclick', (_event, d) => {
        setCollapsed((prev) => {
          const next = new Set(prev);
          if (next.has(d.name)) next.delete(d.name);
          else next.add(d.name);
          return next;
        });
      })
      .on('contextmenu', (event, d) => {
        event.preventDefault();
        setContextMenu({ table: d.name, x: event.clientX, y: event.clientY });
      });

    tableGroups
      .append('rect')
      .attr('width', tableWidth)
      .attr('height', (d) =>
        collapsed.has(d.name) ? rowHeight : rowHeight * (d.columns.length + 1)
      )
      .attr('fill', (d) => (d.name === selected ? '#e0f7fa' : '#fff'))
      .attr('stroke', '#333');

    tableGroups
      .append('text')
      .attr('x', 4)
      .attr('y', rowHeight - 4)
      .text((d) => (collapsed.has(d.name) ? `${d.name} [+]` : `${d.name} [-]`))
      .attr('font-weight', 'bold');

    tableGroups
      .selectAll('text.column')
      .data((d) =>
        collapsed.has(d.name)
          ? []
          : d.columns.map((c) => ({ table: d.name, column: c.name }))
      )
      .enter()
      .append('text')
      .attr('class', 'column')
      .attr('x', 4)
      .attr('y', (_, i) => rowHeight * (i + 2) - 4)
      .text((d) => d.column)
      .attr('font-size', '12px');

    const links: { from: string; to: string }[] = [];
    schema.tables.forEach((t) => {
      t.foreignKeys?.forEach((fk) => {
        if (
          visibleTables.some((vt) => vt.name === t.name) &&
          visibleTables.some((vt) => vt.name === fk.referencedTable)
        ) {
          links.push({ from: t.name, to: fk.referencedTable });
        }
      });
    });

    const lineGenerator = d3.line();

    container
      .selectAll('path.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d) => {
        const from = positions.get(d.from)!;
        const to = positions.get(d.to)!;
        const x1 = from.x + from.width / 2;
        const y1 = from.y + from.height / 2;
        const x2 = to.x + to.width / 2;
        const y2 = to.y + to.height / 2;
        return lineGenerator([
          [x1, y1],
          [x2, y2],
        ] as [number, number][]);
      })
      .attr('fill', 'none')
      .attr('stroke', '#666');

    const bounds = Array.from(positions.values()).reduce(
      (acc, p) => {
        acc.maxX = Math.max(acc.maxX, p.x + p.width);
        acc.maxY = Math.max(acc.maxY, p.y + p.height);
        return acc;
      },
      { maxX: 0, maxY: 0 }
    );

    if (minimapRef.current) {
      const mini = d3.select(minimapRef.current);
      mini.selectAll('*').remove();
      const miniW = +mini.attr('width');
      const miniH = +mini.attr('height');
      const scale = Math.min(
        miniW / (bounds.maxX + margin),
        miniH / (bounds.maxY + margin)
      );
      const miniG = mini
        .append('g')
        .attr('transform', `scale(${scale})`);

      miniG
        .selectAll('rect')
        .data(Array.from(positions.values()))
        .enter()
        .append('rect')
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y)
        .attr('width', (d) => d.width)
        .attr('height', (d) => d.height)
        .attr('fill', '#ccc')
        .attr('stroke', '#999');

      const view = miniG
        .append('rect')
        .attr('fill', 'none')
        .attr('stroke', 'red');

      const updateViewport = () => {
        const [x1, y1] = transform.invert([0, 0]);
        const [x2, y2] = transform.invert([width, height]);
        view
          .attr('x', x1)
          .attr('y', y1)
          .attr('width', x2 - x1)
          .attr('height', y2 - y1);
      };

      updateViewport();

      mini.on('click', (event) => {
        const point = d3.pointer(event);
        const x = point[0] / scale;
        const y = point[1] / scale;
        const newTransform = d3.zoomIdentity
          .translate(width / 2 - x * transform.k, height / 2 - y * transform.k)
          .scale(transform.k);
        svg.transition().call(zoomBehavior.transform as any, newTransform);
      });
    }
  }, [schema, selected, collapsed, search, transform]);

  const exportPng = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = 'schema.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };

  return (
    <div style={{ position: 'relative', width, height }} onClick={() => setContextMenu(null)}>
      <div style={{ marginBottom: 4 }}>
        <input
          placeholder="Search tables"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={exportPng}>Export PNG</button>
      </div>
      <svg ref={svgRef} width={width} height={height} style={{ border: '1px solid #ccc' }}></svg>
      <svg
        ref={minimapRef}
        width={150}
        height={150}
        style={{ position: 'absolute', right: 0, bottom: 0, border: '1px solid #ccc', background: '#fff' }}
      ></svg>
      {contextMenu && (
        <ul
          style={{ position: 'absolute', top: contextMenu.y, left: contextMenu.x, background: '#fff', border: '1px solid #ccc', padding: 4, listStyle: 'none' }}
        >
          <li
            onClick={() => {
              onTableSelect?.(contextMenu.table);
              setContextMenu(null);
            }}
          >
            Add to algorithm
          </li>
          <li
            onClick={() => {
              console.log('Show related', contextMenu.table);
              setContextMenu(null);
            }}
          >
            Show related tables
          </li>
          <li
            onClick={() => {
              navigator.clipboard.writeText(contextMenu.table);
              setContextMenu(null);
            }}
          >
            Copy name
          </li>
        </ul>
      )}
    </div>
  );
}
