import _ from 'lodash'

const getBorderStyle = border => {
  if (border) {
    return { style: 'thin' }
  }
  return {}
}

const setCellStyle = (cell, style) => {
  if (style.border) {
    const { top, left, bottom, right } = style.border
    cell.border = {
      top: getBorderStyle(top),
      left: getBorderStyle(left),
      bottom: getBorderStyle(bottom),
      right: getBorderStyle(right)
    }
  }
  cell.alignment = style.alignment || {}
  cell.font = style.font || {}
}

const getSheetColumns = content => {
  const table = _.find(
    content,
    item => item.type === 'table' && item.decisiveColumn
  )
  return table.columns.length
}

const diyToSheetRowHeight = (worksheet, rowHeight) => {
  const sheetRows = worksheet.rowCount
  let columnIndex = 1
  while (columnIndex < sheetRows) {
    const row = worksheet.getRow(columnIndex)
    row.height = rowHeight
    columnIndex++
  }
}

const diyToSheetColWidth = (worksheet, colWidth) => {
  const sheetColumns = worksheet.columnCount
  let columnIndex = 1
  while (columnIndex <= sheetColumns) {
    const col = worksheet.getColumn(columnIndex)
    col.width = colWidth
    columnIndex++
  }
}

export {
  setCellStyle,
  getBorderStyle,
  getSheetColumns,
  diyToSheetRowHeight,
  diyToSheetColWidth
}
