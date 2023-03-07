import _ from 'lodash'

import { diyToSheetTable } from './paint/table'
import { diyToSheetBlockPre } from './paint/block'
import {
  getColumnLength,
  diyToSheetRowHeight,
  diyToSheetColWidth,
  setSheetRowFill
} from './util'

const _doExportCoreV2 = (config, data, worksheet) => {
  const sheetColumns = getColumnLength(config)

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
const exportCoreV2 = (diyOriginals, diyOptions, workbook) => {
  const sheetName = diyOptions.sheetName
  const worksheet = workbook.addWorksheet(sheetName)

  const { config, sheetDatas } = diyOriginals
  const sheetDatasLength = sheetDatas.length - 1
  const sheetColumns = getColumnLength(config)
  const needFill = _.find(config, item => item.fill)

  _.forEach(sheetDatas, (data, index) => {
    _doExportCoreV2(config, data, worksheet)
    const fillData = {
      fromIndex: worksheet.rowCount + 1,
      sheetColumns,
      worksheet,
      needFill
    }
    // 一个sheet上存在多个配送单，使用红色背景行分割
    if (sheetDatasLength !== index && needFill) {
      setSheetRowFill(fillData)
    } else {
      worksheet.addRow()
    }
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

const exportCoreV2MergerOrder = (diyOriginals, diyOptions, workbook) => {
  const sheetName = diyOptions.sheetName
  const worksheet = workbook.addWorksheet(sheetName)

  const { config: configs, sheetDatas } = diyOriginals
  _.forEach(configs, (config, index) => {
    const sheetDatasLength = sheetDatas.length - 1
    const sheetColumns = getColumnLength(config)
    const needFill = _.find(config, item => item.fill)
    const data = sheetDatas[index]
    // _.forEach(sheetDatas, (data, index) => {
    _doExportCoreV2(config, data, worksheet)
    const fillData = {
      fromIndex: worksheet.rowCount + 1,
      sheetColumns,
      worksheet,
      needFill
    }
    // 一个sheet上存在多个配送单，使用红色背景行分割
    if (sheetDatasLength !== index && needFill) {
      setSheetRowFill(fillData)
    } else {
      worksheet.addRow()
    }
    // })
    // 自定义sheet列宽, 行高, 放在最后操作
    const style = _.find(config, item => item.type === 'style')
    if (style && style.colWidth) {
      diyToSheetColWidth(worksheet, style.colWidth)
    }
    if (style && style.rowHeight) {
      diyToSheetRowHeight(worksheet, style.rowHeight)
    }
  })
}
export { exportCoreV2, exportCoreV2MergerOrder }
