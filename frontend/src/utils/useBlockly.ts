import { useEffect, useRef, useCallback } from 'react'
import * as Blockly from 'blockly'
import type { ToolboxDefinition } from 'blockly/core/utils/toolbox'
import type { WorkspaceSvg } from 'blockly'

export function useBlockly(toolbox: ToolboxDefinition, initialXml?: string) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const workspaceRef = useRef<WorkspaceSvg | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    workspaceRef.current = Blockly.inject(containerRef.current, {
      toolbox,
    })

    if (initialXml) {
      const dom = Blockly.Xml.textToDom(initialXml)
      Blockly.Xml.domToWorkspace(dom, workspaceRef.current)
    }

    return () => {
      workspaceRef.current?.dispose()
    }
  }, [toolbox, initialXml])

  const saveXml = useCallback((): string => {
    if (!workspaceRef.current) return ''
    const dom = Blockly.Xml.workspaceToDom(workspaceRef.current)
    return Blockly.Xml.domToPrettyText(dom)
  }, [])

  const loadXml = useCallback((xml: string) => {
    if (!workspaceRef.current) return
    workspaceRef.current.clear()
    const dom = Blockly.Xml.textToDom(xml)
    Blockly.Xml.domToWorkspace(dom, workspaceRef.current)
  }, [])

  const clear = useCallback(() => {
    workspaceRef.current?.clear()
  }, [])

  const undo = useCallback(() => {
    workspaceRef.current?.undo(false)
  }, [])

  const redo = useCallback(() => {
    workspaceRef.current?.undo(true)
  }, [])

  return {
    containerRef,
    saveXml,
    loadXml,
    clear,
    undo,
    redo,
    workspaceRef,
  }
}
