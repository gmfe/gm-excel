import {
  diyToSheetRowAverage,
  diyToSheetRowInOrder,
  diyToSheetRowAll
} from './row'
import _ from 'lodash'

/**
 * 需要记录
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

export { diyToSheetBlock }
