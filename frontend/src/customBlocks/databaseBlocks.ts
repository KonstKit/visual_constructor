import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { TYPE_COLORS } from './collectionBlocks'
import type { Schema } from '../types/api'

let schema: Schema | null = null

function getTableOptions() {
  if (!schema) return [['table', 'table']]
  return schema.tables.map(t => [t.name, t.name])
}

export function setSchema(newSchema: Schema) {
  schema = newSchema
}

export function registerDatabaseBlocks() {
  // db_query block
  Blockly.Blocks['db_query'] = {
    init() {
      this.appendDummyInput()
        .appendField('select from')
        .appendField(new Blockly.FieldDropdown(() => getTableOptions()), 'TABLE')
      this.appendValueInput('WHERE')
        .setCheck('String')
        .appendField('where')
      this.setOutput(true, 'Array')
      this.setColour(TYPE_COLORS.Array)
      this.setTooltip('Query table')
    },
  }

  Blockly.Blocks['db_get_field'] = {
    init() {
      this.appendValueInput('RECORD')
        .appendField('record')
      this.appendDummyInput()
        .appendField('.')
        .appendField(new Blockly.FieldDropdown(function () {
          const block = this.getSourceBlock ? this.getSourceBlock() : null;
          if (!block) return [['field', 'field']];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recordBlock = block.getInputTargetBlock && block.getInputTargetBlock('RECORD');
          let cols: string[] = [];
          if (recordBlock && recordBlock.type === 'db_query') {
            const table = recordBlock.getFieldValue('TABLE');
            const t = schema?.tables.find(t => t.name === table);
            cols = t ? t.columns.map(c => c.name) : [];
          } else if (schema) {
            cols = schema.tables.flatMap(t => t.columns.map(c => c.name));
          }
          if (cols.length === 0) cols = ['field'];
          const uniq = Array.from(new Set(cols));
          return uniq.map(c => [c, c]);
        }), 'FIELD')
      this.setOutput(true)
      this.setColour(TYPE_COLORS.Object)
      this.setTooltip('Get field from record')
    },
  }

  javascriptGenerator['db_query'] = function (block) {
    const table = block.getFieldValue('TABLE')
    const where = javascriptGenerator.valueToCode(block, 'WHERE', javascriptGenerator.ORDER_NONE) || "''"
    const code = `db.query('${table}', ${where})`
    return [code, javascriptGenerator.ORDER_FUNCTION_CALL]
  }

  javascriptGenerator['db_get_field'] = function (block) {
    const rec = javascriptGenerator.valueToCode(block, 'RECORD', javascriptGenerator.ORDER_MEMBER) || '{}'
    const field = block.getFieldValue('FIELD')
    const code = `${rec}['${field}']`
    return [code, javascriptGenerator.ORDER_MEMBER]
  }
}

registerDatabaseBlocks()
