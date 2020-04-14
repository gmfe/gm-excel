import _ from 'lodash'
import { getColumns } from '../util'

const getSheetColumns = content => {
  const table = _.find(
    content,
    item => item.type === 'table' && item.decisiveColumn
  )

  if (!table) {
    Promise.reject(new Error('table need decisiveColumn'))
  }
  return table.columns.length
}

const getColumnLength = content => {
  let len = 1
  _.each(content, temp => {
    if (temp.type === 'table') {
      if (temp.columns.length > len) {
        len = temp.columns.length
      }
    } else if (temp.type === 'block') {
      _.each(temp.block.rows, row => {
        if (row.columns.length > len) {
          len = row.columns.length
        }
      })
    }
  })
  return len
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

const exportSample = (sheets, options, workbook) => {
  const sheetNames = options.sheetNames || []
  _.forEach(sheets, (sheet, key) => {
    const sheetName = sheetNames[key] || `Sheet${key + 1}`
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = options.columns || getColumns(sheet[0])
    worksheet.addRows(sheet)
  })
}

export {
  getColumnLength,
  getSheetColumns,
  diyToSheetRowHeight,
  diyToSheetColWidth,
  exportSample
}
