import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

export const TYPE_COLORS = {
  Array: 260,
  Object: 20,
  String: 160,
} as const

export function registerCollectionBlocks() {
  Blockly.Blocks['collection_filter'] = {
    init() {
      this.appendValueInput('COLLECTION')
        .setCheck('Array')
        .appendField('filter')
      this.appendDummyInput()
        .appendField('item as')
        .appendField(new Blockly.FieldVariable('item'), 'VAR')
      this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('where')
      this.setOutput(true, 'Array')
      this.setColour(TYPE_COLORS.Array)
      this.setTooltip('Filter collection by condition')
    },
  }

  Blockly.Blocks['collection_map'] = {
    init() {
      this.appendValueInput('COLLECTION')
        .setCheck('Array')
        .appendField('map')
      this.appendDummyInput()
        .appendField('item as')
        .appendField(new Blockly.FieldVariable('item'), 'VAR')
      this.appendValueInput('TRANSFORM')
        .appendField('to')
      this.setOutput(true, 'Array')
      this.setColour(TYPE_COLORS.Array)
      this.setTooltip('Transform each element')
    },
  }

  Blockly.Blocks['collection_reduce'] = {
    init() {
      this.appendValueInput('COLLECTION')
        .setCheck('Array')
        .appendField('aggregate')
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['sum', 'SUM'],
          ['avg', 'AVG'],
          ['min', 'MIN'],
          ['max', 'MAX'],
        ]), 'OP')
      this.appendDummyInput()
        .appendField('field')
        .appendField(new Blockly.FieldTextInput('value'), 'FIELD')
      this.setOutput(true, 'Number')
      this.setColour(TYPE_COLORS.Array)
      this.setTooltip('Aggregate values of a field')
    },
  }

  Blockly.Blocks['collection_sort'] = {
    init() {
      this.appendValueInput('COLLECTION')
        .setCheck('Array')
        .appendField('sort')
      this.appendDummyInput()
        .appendField('by')
        .appendField(new Blockly.FieldTextInput('field'), 'FIELD')
      this.setOutput(true, 'Array')
      this.setColour(TYPE_COLORS.Array)
      this.setTooltip('Sort array by field')
    },
  }

  const jexlGenerator = javascriptGenerator

  jexlGenerator['collection_filter'] = function (block) {
    const collection = jexlGenerator.valueToCode(block, 'COLLECTION', jexlGenerator.ORDER_NONE) || '[]'
    const variable = block.getFieldValue('VAR')
    const condition = jexlGenerator.valueToCode(block, 'CONDITION', jexlGenerator.ORDER_NONE) || 'true'
    const code = `${collection}.filter((${variable}) => ${condition})`
    return [code, jexlGenerator.ORDER_FUNCTION_CALL]
  }

  jexlGenerator['collection_map'] = function (block) {
    const collection = jexlGenerator.valueToCode(block, 'COLLECTION', jexlGenerator.ORDER_NONE) || '[]'
    const variable = block.getFieldValue('VAR')
    const transform = jexlGenerator.valueToCode(block, 'TRANSFORM', jexlGenerator.ORDER_NONE) || variable
    const code = `${collection}.map((${variable}) => ${transform})`
    return [code, jexlGenerator.ORDER_FUNCTION_CALL]
  }

  jexlGenerator['collection_reduce'] = function (block) {
    const collection = jexlGenerator.valueToCode(block, 'COLLECTION', jexlGenerator.ORDER_NONE) || '[]'
    const field = block.getFieldValue('FIELD')
    const op = block.getFieldValue('OP')
    const values = field
      ? `${collection}.map(item => item['${field}'])`
      : collection
    let code
    switch (op) {
      case 'SUM':
        code = `${values}.reduce((a,b)=>a+b,0)`
        break
      case 'AVG':
        code = `(${values}.reduce((a,b)=>a+b,0))/(${values}.length)`
        break
      case 'MIN':
        code = `${values}.reduce((a,b)=>a<b?a:b,Infinity)`
        break
      case 'MAX':
        code = `${values}.reduce((a,b)=>a>b?a:b,-Infinity)`
        break
      default:
        code = `${values}.reduce((a,b)=>a+b,0)`
    }
    return [code, jexlGenerator.ORDER_FUNCTION_CALL]
  }

  jexlGenerator['collection_sort'] = function (block) {
    const collection = jexlGenerator.valueToCode(block, 'COLLECTION', jexlGenerator.ORDER_NONE) || '[]'
    const field = block.getFieldValue('FIELD')
    const code = `${collection}.slice().sort((a,b)=>a['${field}']>b['${field}']?1:-1)`
    return [code, jexlGenerator.ORDER_FUNCTION_CALL]
  }
}

registerCollectionBlocks()
