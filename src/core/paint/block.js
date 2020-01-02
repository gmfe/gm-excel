import _ from 'lodash'

import {
  diyToSheetRowAverage,
  diyToSheetRowInOrder,
  diyToSheetRowAll,
  diyCustomToSheetRow
} from './row'
import { diyCustomToSheetMergeCells } from './cell'

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
    if (item.layout === 'average') {
      diyToSheetRowAverage(row, sheetColumns, worksheet)
    } else if (item.layout === 'inOrder') {
      diyToSheetRowInOrder(row, sheetColumns, worksheet)
    } else {
      diyToSheetRowAll(row, sheetColumns, worksheet)
    }
  })
}

const diyCustomToSheetBlock = (blockData, worksheet) => {
  const { block, fromIndex, data } = blockData
  const { rows } = block

  _.forEach(data, (item, index) => {
    let style = block.style || {}
    // 行样式
    if (rows[0].style) {
      style = {
        ...style,
        ...item.style
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
  // 合并单元格
  diyCustomToSheetMergeCells(fromIndex, rows[0].columns, worksheet)
}

export { diyToSheetBlockPre, diyToSheetBlock }
