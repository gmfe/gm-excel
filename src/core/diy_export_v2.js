import _ from 'lodash'

import { diyToSheetTable } from './paint/table'
import { diyToSheetBlockPre } from './paint/block'
import {
  getSheetColumns,
  diyToSheetRowHeight,
  diyToSheetColWidth
} from './util'

const diyToSheetCoreV2 = (config, data, worksheet) => {
  const sheetColumns = getSheetColumns(config)

  _.forEach(config, item => {
    const itemData = _.find(data, v => v.id === item.id)
    const initIndex = worksheet.rowCount + 1

    if (item.type === 'block') {
      // 插入空行
      diyToSheetBlockPre({ item, initIndex, itemData, sheetColumns }, worksheet)
    } else if (item.type === 'table') {
      const tableData = {
        table: item,
        fromIndex: initIndex,
        data: itemData
      }

      diyToSheetTable(tableData, worksheet)
    }
  })
}

/**
 * diyOriginals - { config, sheetDatas }
 * - config, 对象数组, 配置模板, 每个元素代表block或table
 * - sheetDatas, array, 总sheet数据
 * diyOptions - [{ sheetName, ...}, ...]
 */
const diyToSheetV2 = (diyOriginals, diyOptions, workbook) => {
  const sheetName = diyOptions.sheetName
  const worksheet = workbook.addWorksheet(sheetName)

  const { config, sheetDatas } = diyOriginals
  _.forEach(sheetDatas, data => {
    diyToSheetCoreV2(config, data, worksheet)
    worksheet.addRow()
  })

  // 自定义sheet列宽, 行高, 放在最后操作
  const style = _.find(config, item => item.type === 'style')
  if (style && style.colWidth) {
    diyToSheetColWidth(worksheet, style.colWidth)
  }
  if (style && style.rowHeight) {
    diyToSheetRowHeight(worksheet, style.rowHeight)
  }
}

export { diyToSheetV2 }
