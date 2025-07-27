import { useEffect, useRef, useState } from 'react'
import { Button, Stack } from '@mui/material'
import BlocklyWorkspace from '../components/BlocklyWorkspace'
import type { BlocklyWorkspaceHandle } from '../components/BlocklyWorkspace'
import { basicToolbox } from '../blockly/basicToolbox'
import SchemaVisualizer from '../components/SchemaVisualizer'
import { setSchema } from '../customBlocks/databaseBlocks'
import '../customBlocks/databaseBlocks'
import '../customBlocks/collectionBlocks'
import { collectionDemoXml } from '../blockly/demo/collectionDemo'
import type { Schema } from '../types/api'

const demoSchema: Schema = {
  tables: [
    {
      name: 'users',
      columns: [
        { name: 'id', dataType: 'int', nullable: false, primaryKey: true },
        { name: 'name', dataType: 'varchar', nullable: false, primaryKey: false },
      ],
      foreignKeys: [],
    },
    {
      name: 'orders',
      columns: [
        { name: 'id', dataType: 'int', nullable: false, primaryKey: true },
        { name: 'user_id', dataType: 'int', nullable: false, primaryKey: false },
      ],
      foreignKeys: [
        { columnName: 'user_id', referencedTable: 'users', referencedColumn: 'id' },
      ],
    },
  ],
}

export default function AlgorithmBuilder() {
  const workspaceRef = useRef<BlocklyWorkspaceHandle>(null)
  const [savedXml, setSavedXml] = useState('')

  useEffect(() => {
    setSchema(demoSchema)
  }, [])

  const handleSave = () => {
    const xml = workspaceRef.current?.saveXml() ?? ''
    setSavedXml(xml)
    localStorage.setItem('blocklyXml', xml)
  }

  const handleLoad = () => {
    const xml = savedXml || localStorage.getItem('blocklyXml') || ''
    if (xml) {
      workspaceRef.current?.loadXml(xml)
    }
  }

  const handleClear = () => workspaceRef.current?.clear()
  const handleUndo = () => workspaceRef.current?.undo()
  const handleRedo = () => workspaceRef.current?.redo()

  const handleTableSelect = (table: string) => {
    const block = workspaceRef.current?.createBlock('db_query', 10, 10)
    block?.setFieldValue(table, 'TABLE')
  }

  useEffect(() => {
    let cleanup: (() => void) | null = null
    const check = () => {
      const container = workspaceRef.current?.getContainer()
      const workspace = workspaceRef.current?.getWorkspace()
      if (!container || !workspace) return

      const onDragOver = (e: DragEvent) => {
        if (e.dataTransfer?.types.includes('text/plain')) e.preventDefault()
      }

      const onDrop = (e: DragEvent) => {
        const table = e.dataTransfer?.getData('text/plain')
        if (!table) return
        e.preventDefault()
        const rect = container.getBoundingClientRect()
        const x = (e.clientX - rect.left) / workspace.scale + workspace.scrollX
        const y = (e.clientY - rect.top) / workspace.scale + workspace.scrollY
        const block = workspaceRef.current?.createBlock('db_query', x, y)
        block?.setFieldValue(table, 'TABLE')
      }

      container.addEventListener('dragover', onDragOver)
      container.addEventListener('drop', onDrop)
      cleanup = () => {
        container.removeEventListener('dragover', onDragOver)
        container.removeEventListener('drop', onDrop)
      }
    }

    const id = setInterval(() => {
      if (workspaceRef.current?.getWorkspace()) {
        clearInterval(id)
        check()
      }
    }, 100)
    return () => {
      clearInterval(id)
      cleanup?.()
    }
  }, [])

  return (
    <div style={{ padding: 16, display: 'flex', gap: 16 }}>
      <SchemaVisualizer schema={demoSchema} onTableSelect={handleTableSelect} />
      <div style={{ flex: 1 }}>
        <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" onClick={handleLoad}>
          Load
        </Button>
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="outlined" onClick={handleUndo}>
          Undo
        </Button>
        <Button variant="outlined" onClick={handleRedo}>
          Redo
        </Button>
      </Stack>
      <BlocklyWorkspace
        ref={workspaceRef}
        toolbox={basicToolbox}
        initialXml={collectionDemoXml}
        className="blockly-container"
      />
      </div>
    </div>
  )
}
