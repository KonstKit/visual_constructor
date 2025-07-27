import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Schema } from '../types/api';

interface Props {
  schema: Schema;
  width?: number;
  height?: number;
}

type TablePosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function SchemaVisualizer({ schema, width = 800, height = 600 }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      container.attr('transform', event.transform);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    svg.call(zoomBehavior as any);

    const tableWidth = 150;
    const rowHeight = 20;
    const margin = 40;
    const positions = new Map<string, TablePosition>();

    const tableGroups = container
      .selectAll('g.table')
      .data(schema.tables)
      .enter()
      .append('g')
      .attr('class', 'table')
      .attr('transform', (d, i) => {
        const x = (i % 3) * (tableWidth + margin);
        const y = Math.floor(i / 3) * (150 + margin);
        const height = rowHeight * (d.columns.length + 1);
        positions.set(d.name, { x, y, width: tableWidth, height });
        return `translate(${x},${y})`;
      })
      .on('click', (_event, d) => {
        setSelected((prev) => (prev === d.name ? null : d.name));
      });

    tableGroups
      .append('rect')
      .attr('width', tableWidth)
      .attr('height', (d) => rowHeight * (d.columns.length + 1))
      .attr('fill', (d) => (d.name === selected ? '#e0f7fa' : '#fff'))
      .attr('stroke', '#333');

    tableGroups
      .append('text')
      .attr('x', 4)
      .attr('y', rowHeight - 4)
      .text((d) => d.name)
      .attr('font-weight', 'bold');

    tableGroups
      .selectAll('text.column')
      .data((d) => d.columns.map((c) => ({ table: d.name, column: c.name })))
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
        links.push({ from: t.name, to: fk.referencedTable });
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
  }, [schema, selected]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
}
