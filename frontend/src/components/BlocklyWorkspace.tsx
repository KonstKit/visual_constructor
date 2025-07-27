import { forwardRef, useImperativeHandle } from 'react'
import type { ToolboxDefinition } from 'blockly/core/utils/toolbox'
import type { WorkspaceSvg, Block } from 'blockly'
import * as Blockly from 'blockly'
import { basicToolbox } from '../blockly/basicToolbox'
import { useBlockly } from '../utils/useBlockly'

export interface BlocklyWorkspaceHandle {
  saveXml: () => string
  loadXml: (xml: string) => void
  clear: () => void
  undo: () => void
  redo: () => void
  getWorkspace: () => WorkspaceSvg | null
  getContainer: () => HTMLDivElement | null
  createBlock: (type: string, x?: number, y?: number) => Blockly.Block | null
}

interface Props {
  toolbox?: ToolboxDefinition
  initialXml?: string
  className?: string
}

const BlocklyWorkspace = forwardRef<BlocklyWorkspaceHandle, Props>(
  function BlocklyWorkspace({ toolbox = basicToolbox, initialXml, className }, ref) {
    const { containerRef, saveXml, loadXml, clear, undo, redo, workspaceRef } = useBlockly(toolbox, initialXml)

    const createBlock = (type: string, x?: number, y?: number): Block | null => {
      const workspace = workspaceRef.current
      if (!workspace) return null
      const block = workspace.newBlock(type)
      block.initSvg()
      block.render()
      if (typeof x === 'number' && typeof y === 'number') {
        block.moveBy(x, y)
      }
      return block
    }

    useImperativeHandle(
      ref,
      () => ({
        saveXml,
        loadXml,
        clear,
        undo,
        redo,
        getWorkspace: () => workspaceRef.current,
        getContainer: () => containerRef.current,
        createBlock,
      }),
      [saveXml, loadXml, clear, undo, redo],
    )

    return <div ref={containerRef} className={className} style={{ height: '600px' }} />
  },
)

export default BlocklyWorkspace
