import _ from 'lodash'

import { diyToSheetTable } from './paint/table'
import { diyToSheetBlock } from './paint/block'
import { setCellStyle, getSheetColumns } from '../util'

const diyToSheetTitle = (row, sheetColumns, worksheet) => {
  const { title, fromIndex, data } = row
  const { key } = title
  worksheet.addRow([data[key]])
  worksheet.mergeCells(fromIndex, 1, fromIndex + 1, sheetColumns)

  // style
  const style = title.style
  const cell = worksheet.getRow(fromIndex).getCell(1)
  setCellStyle(cell, style)
}

/**
 * fromIndex - 起始行
 * header - 头部模板信息
 * data - 数据
 */
const diyToSheetHeader = headerData => {
  const { fromIndex, header, data, sheetColumns, worksheet } = headerData
  const { title, block } = header
  const { common } = data
  const row_title = {
    title,
    fromIndex,
    data: common
  }
  const _block = {
    block,
    fromIndex: fromIndex + 2,
    data: common
  }

  diyToSheetTitle(row_title, sheetColumns, worksheet)
  diyToSheetBlock(_block, sheetColumns, worksheet)
}

const diyTosheetContent = contentData => {
  const { content, data, sheetColumns, worksheet } = contentData
  _.forEach(content, (item, index) => {
    const initIndex = worksheet.rowCount + 1

    if (item.type === 'table') {
      const _tableData = _.find(data.table, v => v.id === item.id)
      const tableData = {
        table: item,
        fromIndex: initIndex,
        data: _tableData
      }

      diyToSheetTable(tableData, worksheet)
    } else {
      // 插入空行
      if (!item.block.rows.length) {
        worksheet.addRow()
      } else {
        // 插入block数据
        const _blockData = _.find(data.block, v => v.id === item.id)
        const blockData = {
          block: item.block,
          fromIndex: initIndex,
          data: _blockData.columns
        }

        diyToSheetBlock(blockData, sheetColumns, worksheet)
      }
    }
  })
}

const diyToSheetCore = (diyOriginals, worksheet) => {
  // data -- { common, table, block }
  const { config, sheetDatas } = diyOriginals
  const { header, content, footer } = config
  // 表格总列数, 由table决定
  const sheetColumns = getSheetColumns(content)

  _.forEach(sheetDatas, data => {
    const headerData = {
      fromIndex: worksheet.rowCount + 1,
      header,
      data,
      sheetColumns,
      worksheet
    }
    diyToSheetHeader(headerData)

    const contentData = {
      content,
      data,
      sheetColumns,
      worksheet
    }
    diyTosheetContent(contentData)

    // footer不一定存在
    if (footer) {
      const footerData = {
        block: footer.block,
        fromIndex: worksheet.rowCount + 1,
        data: data.common
      }
      diyToSheetBlock(footerData, sheetColumns, worksheet)
    }

    worksheet.addRows([{}, {}])
  })
}

/**
 * diyOriginals - { config, sheetDatas }
 * - config, object, 配置模板
 * - sheetDatas, array, 总sheet数据
 * diyOptions - [{ sheetName, ...}, ...]
 */
const diyToSheet = (diyOriginals, diyOptions, workbook) => {
  const sheetName = diyOptions.sheetName
  const worksheet = workbook.addWorksheet(sheetName)
  diyToSheetCore(diyOriginals, worksheet)

  // 自定义sheet列宽
  const { config } = diyOriginals
  const { content } = config
  const sheetColumns = getSheetColumns(content)
  if (config.colWidth) {
    let columnIndex = 1
    while (columnIndex <= sheetColumns) {
      const col = worksheet.getColumn(columnIndex)
      col.width = config.colWidth
      columnIndex++
    }
  }

  // 自定义行高
  const sheetRows = worksheet.rowCount
  if (config.rowHeight) {
    let columnIndex = 1
    while (columnIndex < sheetRows) {
      const row = worksheet.getRow(columnIndex)
      row.height = config.rowHeight
      columnIndex++
    }
  }
}

export { diyToSheet }
