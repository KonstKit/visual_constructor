import { describe, it, expect, beforeEach } from 'vitest'
import * as Blockly from 'blockly/node'
import { javascriptGenerator } from 'blockly/javascript'
import { setSchema } from './databaseBlocks'
import './databaseBlocks'
import type { Schema } from '../types/api'

const schema: Schema = {
  tables: [
    { name: 'users', columns: [
        { name: 'id', dataType: 'int', nullable: false, primaryKey: true },
        { name: 'name', dataType: 'varchar', nullable: false, primaryKey: false }
      ], foreignKeys: [] },
  ],
}

let workspace: Blockly.Workspace

beforeEach(() => {
  workspace = new Blockly.Workspace()
  javascriptGenerator.init(workspace)
  setSchema(schema)
})

describe('db_query generator', () => {
  it('generates query code', () => {
    const block = workspace.newBlock('db_query')
    block.setFieldValue('users', 'TABLE')
    const cond = workspace.newBlock('text')
    cond.setFieldValue('id > 5', 'TEXT')
    block.getInput('WHERE')!.connection!.connect(cond.outputConnection!)

    const code = javascriptGenerator.blockToCode(block) as [string, number]
    expect(code[0]).toBe("db.query('users', 'id > 5')")
  })
})

describe('db_get_field generator', () => {
  it('generates field access', () => {
    const block = workspace.newBlock('db_get_field')
    const rec = workspace.newBlock('variables_get')
    const varModel = workspace.createVariable('row')
    rec.setFieldValue(varModel.getId(), 'VAR')
    block.getInput('RECORD')!.connection!.connect(rec.outputConnection!)

    const code = javascriptGenerator.blockToCode(block) as [string, number]
    expect(code[0]).toBe("row['field']")
  })
})
