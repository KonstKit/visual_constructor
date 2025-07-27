import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'
import { TYPE_COLORS } from './collectionBlocks'

const TABLES = ['users', 'orders']

export function registerDatabaseBlocks() {
  // db_query block
  Blockly.Blocks['db_query'] = {
    init() {
      this.appendDummyInput()
        .appendField('select from')
        .appendField(new Blockly.FieldDropdown(TABLES.map(t => [t, t])), 'TABLE')
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
        .appendField(new Blockly.FieldTextInput('field'), 'FIELD')
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
