import _ from 'lodash'

import {
  diyToSheetRowAverage,
  diyToSheetRowInOrder,
  diyToSheetRowAll,
  diyCustomToSheetRow
} from './row'
import { diyCustomToSheetMergeCells, setCellStyle } from './cell'

const diyToSheetBlockPre = (
  { item, initIndex, itemData, sheetColumns },
  worksheet
) => {
  if (!item.block.rows.length) {
    worksheet.addRow()
    return
  }

  const blockData = {
    block: item.block,
    fromIndex: initIndex,
    data: itemData.columns
  }

  if (item.customer) {
    // 自定义单元格合并
    diyCustomToSheetBlock(blockData, worksheet)
  } else {
    diyToSheetBlock(blockData, sheetColumns, worksheet)
  }
}

/**
 * blockData -- block相关数据和配置
 * block -- block配置, { style, rows }
 * formIndex -- 起始行
 * data -- block数据，对象数据，一个元素代表一行字段值
 * */
const diyToSheetBlock = (blockData, sheetColumns, worksheet) => {
  const { block, fromIndex, data } = blockData

  _.forEach(block.rows, (item, index) => {
    let style = block.style || {}
    // 行样式
    if (item.style) {
      style = {
        ...style,
        ...item.style
      }
    }

    // 整理每行信息
    const row = {
      rowIndex: index + fromIndex,
      rowKeys: item.columns,
      rowData: data.length ? data[index] : data,
      rowStyle: style
    }

    // 插入数据 layout: 'average' - 均分表格插入, 'inOrder' - 顺序插入表格, 'all' - 占据整行插入
    switch (item.layout) {
      case 'average':
        diyToSheetRowAverage(row, sheetColumns, worksheet)
        break
      case 'all':
        diyToSheetRowAll(row, sheetColumns, worksheet)
        break
      default:
        diyToSheetRowInOrder(row, sheetColumns, worksheet)
    }
  })
}

const diyCustomToSheetBlock = (blockData, worksheet) => {
  const { block, fromIndex, data } = blockData
  const { rows } = block

  _.forEach(data, (item, index) => {
    let style = block.style || {}
    // 行样式：合并 rows[0].style（此前误写成 item.style）
    if (rows[0].style) {
      style = {
        ...style,
        ...rows[0].style
      }
    }

    const row = {
      rowIndex: index + fromIndex,
      rowKeys: rows[0].columns,
      rowData: item,
      rowStyle: style
    }
    diyCustomToSheetRow(row, worksheet)
  })
  // 合并单元格（与既有逻辑一致：按 rows[0].columns 从 fromIndex 合并）
  diyCustomToSheetMergeCells(fromIndex, rows[0].columns, worksheet)

  // 合并后按 size 占列偏移，把 column.style 落到合并锚点单元格
  let mergedStyle = block.style || {}
  if (rows[0].style) {
    mergedStyle = { ...mergedStyle, ...rows[0].style }
  }
  let colOffset = 1
  _.forEach(rows[0].columns, column => {
    if (column.style) {
      const cell = worksheet.getRow(fromIndex).getCell(colOffset)
      setCellStyle(cell, { ...mergedStyle, ...column.style })
    }
    colOffset += (column.size && column.size[1]) || 1
  })
}

export { diyToSheetBlockPre, diyToSheetBlock }
