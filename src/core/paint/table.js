import _ from 'lodash'

import { getBorderStyle } from './cell'

/** table - { fromIndex, table, tableRowCount, style }
 */
const setTableColumnsStyle = (tableColumnsSet, worksheet) => {
  const { fromIndex, table, tableRowCount, style } = tableColumnsSet
  // 找不到设置table列的除font外的样式设置办法，只能 一层一层 设置
  const { columns } = table

  _.forEach(columns, (column, i) => {
    const col = worksheet.getColumn(i + 1)

    col.eachCell((cell, index) => {
      if (index >= fromIndex && index - fromIndex < tableRowCount) {
        // 设置单元格样式
        const columnStyle = column.style || {}
        cell.style = {
          ...style,
          ...columnStyle
        }
      }
    })
  })
}

const setTableStyle = (tableSet, worksheet) => {
  const { fromIndex, table, tableRowCount } = tableSet

  // 默认每一列居中，其它情况需自定义设置
  const defaultAlignment = {
    horizontal: 'center',
    vertical: 'middle'
  }

  // 处理自定义样式
  const tableStyle = table.style
  let tableAlignment = {}
  let tableBorder = {}
  let tableFont = {}
  // 边框定义
  if (tableStyle && tableStyle.border) {
    tableBorder = getBorderStyle(tableStyle.border)
  }

  // 字体粗细定义
  if (tableStyle && tableStyle.font) {
    tableFont = tableStyle.font
  }

  // 水平垂直分布
  if (tableStyle && tableStyle.alignment) {
    tableAlignment = tableStyle.alignment
  } else {
    tableAlignment = defaultAlignment
  }

  // 对表头进行设置，默认居中
  if (!table.disabledHeaderRow) {
    const headerRow = worksheet.getRow(fromIndex)
    headerRow.eachCell(cell => {
      cell.alignment = defaultAlignment
      cell.border = tableBorder
      cell.font = tableFont
    })
  }

  // 处理table的列
  const tableColumnsSet = {
    style: {
      border: tableBorder,
      font: tableFont,
      alignment: tableAlignment
    },
    fromIndex: fromIndex + 1,
    tableRowCount,
    table
  }
  setTableColumnsStyle(tableColumnsSet, worksheet)
}

const getTableRows = (columns, data, worksheet) => {
  const rows = []
  let rowData = []

  _.forEach(data, row => {
    rowData = _.map(columns, column => row[column.key])
    worksheet.addRow(rowData)
    rows.push(rowData)
  })
  return rows
}

const getTableColumns = (table, worksheet) => {
  const { columns } = table
  const col = []
  const _columns = _.map(columns, column => {
    col.push(column.header)
    return {
      header: column.key,
      name: column.header,
      key: column.key
    }
  })

  // 展示表头
  if (!table.disabledHeaderRow) {
    worksheet.addRow(col)
  }

  return _columns
}

/**
 * tableDatas -- { fromIndex, table, data } - { 初始行, table字段设置, 对应数据 }
 * fromInex -- 起始行
 * table -- table配置信息，{ id, type, style, columns}
 * data -- table数据，{id, columns(每行数据)}
 */
const diyToSheetTable = (tableDatas, worksheet) => {
  const { fromIndex, table, data } = tableDatas
  const columns = getTableColumns(table, worksheet)
  const tableData = data.columns
  const tableRows = getTableRows(columns, tableData, worksheet)

  let rowIndex = fromIndex
  if (table.disabledHeaderRow) {
    rowIndex--
  }

  setTableStyle(
    { fromIndex: rowIndex, table, tableRowCount: tableRows.length },
    worksheet
  )
}

export { diyToSheetTable }
