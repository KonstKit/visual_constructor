import { forwardRef, useImperativeHandle } from 'react'
import type { ToolboxDefinition } from 'blockly/core/utils/toolbox'
import { basicToolbox } from '../blockly/basicToolbox'
import { useBlockly } from '../utils/useBlockly'

export interface BlocklyWorkspaceHandle {
  saveXml: () => string
  loadXml: (xml: string) => void
  clear: () => void
  undo: () => void
  redo: () => void
}

interface Props {
  toolbox?: ToolboxDefinition
  initialXml?: string
  className?: string
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle, Props>(
  function BlocklyWorkspace({ toolbox = basicToolbox, initialXml, className }, ref) {
    const { containerRef, saveXml, loadXml, clear, undo, redo } = useBlockly(toolbox, initialXml)

    useImperativeHandle(ref, () => ({ saveXml, loadXml, clear, undo, redo }), [saveXml, loadXml, clear, undo, redo])

    return <div ref={containerRef} className={className} style={{ height: '600px' }} />
  },
)

export default BlocklyWorkspace
