import _ from 'lodash'

import { mergeCells, setCellStyle, diyToSheetMergeCells } from './cell'

const insertDataToRow = (rowData, worksheet) => {
  worksheet.addRow(rowData)
}

const getRowData = (rowKeys, data) => {
  const rowData = []
  _.forEach(rowKeys, column => {
    rowData.push(data[column.key])
  })
  return rowData
}

const setRowStyle = (rowIndex, style, worksheet) => {
  if (style) {
    const nowRow = worksheet.getRow(rowIndex)
    nowRow.eachCell(function(cell, colNumber) {
      setCellStyle(cell, style)
    })
  }
}

/**
 * 按顺序分布行 - 形式为字段名：字段值, 若需合并，操作字段值所在单元格
 * row - 行信息，{ rowIndex, rowKeys, rowData, rowStyle } -> {第几行, 行分布, 行数据, 行样式}
 * rowKeys -- config对应block数据的每一行的columns
 * rowData -- data对应的该行字段信息
 * sheetColumns - sheet总列数
 */
const diyToSheetRowInOrder = (row, sheetColumns, worksheet) => {
  const { rowIndex, rowKeys, rowData, rowStyle } = row

  const _rowData = getRowData(rowKeys, rowData)
  insertDataToRow(_rowData, worksheet)

  // 是否需要合并单元格
  const isNeedMergeCell = rowKeys.length !== sheetColumns
  // 行字段数
  const fieldNum = rowKeys.length / 2
  // 计算每一项需合并的单元格个数
  let mergeCellNum = Math.ceil((sheetColumns - fieldNum) / fieldNum)

  // 可能存在合并单元格数目过大超过总列数, 此时前面字段合并单元格减少
  const totalCell = mergeCellNum * (fieldNum - 1) + fieldNum
  if (totalCell >= sheetColumns) {
    mergeCellNum--
  }

  // style
  setRowStyle(rowIndex, rowStyle, worksheet)

  // 合并单元格操作
  if (isNeedMergeCell) {
    const _row = { data: rowKeys, fieldNum, mergeCellNum, rowIndex, rowStyle }
    diyToSheetMergeCells(_row, sheetColumns, 'inOrder', worksheet)
  }
}

// 均分行 - 形式为字段，若需合并，操作每个字段所在单元格
const diyToSheetRowAverage = (row, sheetColumns, worksheet) => {
  const { rowIndex, rowKeys, rowData, rowStyle } = row

  // 插入数据
  const _rowData = getRowData(rowKeys, rowData)
  insertDataToRow(_rowData, worksheet)

  // style
  setRowStyle(rowIndex, rowStyle, worksheet)

  // 合并单元格
  let mergeCellNum = Math.ceil(sheetColumns / rowKeys.length)
  const fieldNum = rowKeys.length

  // 可能存在合并单元格数目过大超过总列数, 此时前面字段合并单元格减少
  const totalCell = mergeCellNum * (fieldNum - 1)
  if (totalCell >= sheetColumns) {
    mergeCellNum--
  }
  const _row = { data: rowKeys, fieldNum, mergeCellNum, rowIndex, rowStyle }
  diyToSheetMergeCells(_row, sheetColumns, 'average', worksheet)
}

// 合并一整行的情况
const diyToSheetRowAll = (row, sheetColumns, worksheet) => {
  const { rowIndex, rowKeys, rowData, rowStyle } = row
  const dataKey = rowKeys[0].key
  const _rowData = rowData[dataKey]
  insertDataToRow([_rowData], worksheet)

  // 合并单元格
  const from = { row: rowIndex, column: 1 }
  const size = { row: 1, column: sheetColumns }
  mergeCells(from, size, worksheet)

  // style
  const cell = worksheet.getRow(rowIndex).getCell(1)
  setCellStyle(cell, rowStyle)
}

const diyCustomToSheetRow = (row, worksheet) => {
  const { rowIndex, rowKeys, rowData, rowStyle } = row

  // 插入数据
  const _rowData = getRowData(rowKeys, rowData)
  insertDataToRow(_rowData, worksheet)

  // 设置样式
  setRowStyle(rowIndex, rowStyle, worksheet)
}

export {
  insertDataToRow,
  diyToSheetRowInOrder,
  diyToSheetRowAverage,
  diyToSheetRowAll,
  diyCustomToSheetRow
}
