import { describe, it, expect, beforeEach } from 'vitest'
import * as Blockly from 'blockly/node'
import { javascriptGenerator } from 'blockly/javascript'
import './collectionBlocks'

let workspace: Blockly.Workspace

beforeEach(() => {
  workspace = new Blockly.Workspace()
  javascriptGenerator.init(workspace)
})

describe('collection_filter generator', () => {
  it('generates filter code', () => {
    const block = workspace.newBlock('collection_filter')
    const arrVar = workspace.createVariable('arr')
    const arrBlock = workspace.newBlock('variables_get')
    arrBlock.setFieldValue(arrVar.getId(), 'VAR')
    block.getInput('COLLECTION')!.connection!.connect(arrBlock.outputConnection!)
    const cond = workspace.newBlock('logic_boolean')
    cond.setFieldValue('TRUE', 'BOOL')
    block.getInput('CONDITION')!.connection!.connect(cond.outputConnection!)
    block.setFieldValue('x', 'VAR')

    const code = javascriptGenerator.blockToCode(block) as [string, number]
    expect(code[0]).toMatch(/arr\.filter\(\(.+\) => true\)/)
  })
})

describe('collection_map generator', () => {
  it('generates map code', () => {
    const block = workspace.newBlock('collection_map')
    const arrVar = workspace.createVariable('arr')
    const arrBlock = workspace.newBlock('variables_get')
    arrBlock.setFieldValue(arrVar.getId(), 'VAR')
    block.getInput('COLLECTION')!.connection!.connect(arrBlock.outputConnection!)
    const num = workspace.newBlock('math_number')
    num.setFieldValue('2', 'NUM')
    block.getInput('TRANSFORM')!.connection!.connect(num.outputConnection!)
    block.setFieldValue('i', 'VAR')

    const code = javascriptGenerator.blockToCode(block) as [string, number]
    expect(code[0]).toMatch(/arr\.map\(\(.+\) => 2\)/)
  })
})

describe('collection_reduce generator', () => {
  it('generates reduce code for SUM', () => {
    const block = workspace.newBlock('collection_reduce')
    const arrVar = workspace.createVariable('arr')
    const arrBlock = workspace.newBlock('variables_get')
    arrBlock.setFieldValue(arrVar.getId(), 'VAR')
    block.getInput('COLLECTION')!.connection!.connect(arrBlock.outputConnection!)
    block.setFieldValue('SUM', 'OP')
    block.setFieldValue('value', 'FIELD')

    const code = javascriptGenerator.blockToCode(block) as [string, number]
    expect(code[0]).toBe("arr.map(item => item['value']).reduce((a,b)=>a+b,0)")
  })
})

describe('collection_sort generator', () => {
  it('generates sort code', () => {
    const block = workspace.newBlock('collection_sort')
    const arrVar = workspace.createVariable('arr')
    const arrBlock = workspace.newBlock('variables_get')
    arrBlock.setFieldValue(arrVar.getId(), 'VAR')
    block.getInput('COLLECTION')!.connection!.connect(arrBlock.outputConnection!)
    block.setFieldValue('name', 'FIELD')

    const code = javascriptGenerator.blockToCode(block) as [string, number]
    expect(code[0]).toBe("arr.slice().sort((a,b)=>a['name']>b['name']?1:-1)")
  })
})
