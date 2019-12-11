import _ from 'lodash'

import { setCellStyle } from '../../util'

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

const diyToSheetRowStyle = (rowIndex, style, worksheet) => {
  if (style) {
    const nowRow = worksheet.getRow(rowIndex)
    nowRow.eachCell(function(cell, colNumber) {
      setCellStyle(cell, style)
    })
  }
}

/**
 * from - 起始单元格
 * size - 占据的行数, 列数
 */
const mergeCells = (from, size, worksheet) => {
  const top = from.row
  const left = from.column
  const bottom = from.row + size.row - 1
  const right = from.column + size.column - 1
  worksheet.mergeCells(top, left, bottom, right)
}

// 处理合并单元格
const diyToSheetMergeCells = (row, sheetColumns, type, worksheet) => {
  const { data, fieldNum, rowIndex, mergeCellNum, rowStyle } = row
  let column = 0
  _.forEach(data, (item, index) => {
    column++
    let isMerge = 1
    let lastMergeColumnNum = 0
    // inOrder插入时, 只有字段值所在单元格进行合并, average插入时, 每个字段都需进行合并操作
    if (type !== 'average') {
      isMerge = index % 2
    }

    if (isMerge) {
      if (type === 'average') {
        // average -- 第n列 = 前m个字段 * 合并单元格数
        column = index * mergeCellNum + 1
        // 记录不均等时的最后合并个数
        lastMergeColumnNum = sheetColumns - (fieldNum - 1) * mergeCellNum
      } else {
        // inOrder -- 第n列 = 前n个字段 / 2 * 每两个字段所需单元格 + 1（该字段值前面的字段名占据一个单元格）
        column = ((index - 1) / 2) * (mergeCellNum + 1) + 2
        lastMergeColumnNum =
          sheetColumns - (fieldNum - 1) * mergeCellNum - fieldNum
      }

      const from = { row: rowIndex, column }
      let size = { row: 1, column: mergeCellNum }

      // 出现不均分情况，暂时在最后一个处理
      if (index === data.length - 1) {
        size = {
          ...size,
          column: lastMergeColumnNum
        }
      }

      // 插入空单元格进行合并, 不影响插入的数据
      if (column <= sheetColumns) {
        const nowRow = worksheet.getRow(rowIndex)
        const arr = new Array(size.column - 1).fill('')
        nowRow.splice(column + 1, 0, ...arr)
      }
      mergeCells(from, size, worksheet)
    }

    // 自定义独立样式
    const cell = worksheet.getRow(rowIndex).getCell(column)
    if (item.style) {
      setCellStyle(cell, item.style)
    }

    if (!item.style && rowStyle) {
      setCellStyle(cell, rowStyle)
    }

    if (isMerge) {
      column += mergeCellNum - 1
    }
  })
}

/**
 * 按顺序分布行 - 形式为字段名：字段值, 若需合并，操作字段值所在单元格
 * row - 行信息，{ rowIndex, rowKeys, rowData, rowStyle } -> {第几行, 行分布, 行数据, 行样式}
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
  diyToSheetRowStyle(rowIndex, rowStyle, worksheet)

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
  diyToSheetRowStyle(rowIndex, rowStyle, worksheet)

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

export {
  insertDataToRow,
  diyToSheetRowInOrder,
  diyToSheetRowAverage,
  diyToSheetRowAll
}
