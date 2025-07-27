import { useRef, useState } from 'react'
import { Button, Stack } from '@mui/material'
import BlocklyWorkspace from '../components/BlocklyWorkspace'
import type { BlocklyWorkspaceHandle } from '../components/BlocklyWorkspace'
import { basicToolbox } from '../blockly/basicToolbox'

export default function AlgorithmBuilder() {
  const workspaceRef = useRef<BlocklyWorkspaceHandle>(null)
  const [savedXml, setSavedXml] = useState('')

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

  return (
    <div style={{ padding: 16 }}>
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
        className="blockly-container"
      />
   </div>
  )
}
