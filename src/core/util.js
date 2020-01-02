import _ from 'lodash'

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

export { getSheetColumns, diyToSheetRowHeight, diyToSheetColWidth }
