import ExcelJS from 'exceljs'
import _ from 'lodash'
import {
  diyCore,
  exportCoreV2MergerOrder,
  exportCoreV2,
  exportSample
} from './core'
import { getSheetArray, exportXlsx } from './util'

const doImport = file => {
  return new Promise((resolve, reject) => {
    if (!ExcelJS) {
      ExcelJS = window.ExcelJS
    }
    const workbook = new ExcelJS.Workbook()
    const reader = new window.FileReader()
    const option = { includeEmpty: true }
    reader.readAsArrayBuffer(file)
    reader.onload = data => {
      workbook.xlsx.load(data.target.result).then(
        () => {
          const xlsxJson = []
          workbook.eachSheet(worksheet => {
            xlsxJson.push({
              [worksheet.name]: getSheetArray(worksheet, option)
            })
          })
          resolve(xlsxJson)
        },
        err => {
          reject(err)
        }
      )
    }
  })
}

/**
 *
 * @param {*} sheets [[{row},...], ...]
 * @param {*} options {fileName, sheetNames}
 */
const doExport = (sheets, options = {}) => {
  if (!ExcelJS) {
    ExcelJS = window.ExcelJS
  }

  const workbook = new ExcelJS.Workbook()
  const fileName = options.fileName || 'download.xlsx'
  exportSample(sheets, options, workbook)
  exportXlsx(workbook, fileName)
}

/**
 * sheets -- [{ data, config }, ...]
 * - data, array, 对应每个单数据
 * - config, 导出单据模板, 暂时默认一个sheet内所有单对应一个模板
 * options -- {fileName, sheetOptions: [{ sheetName, ...}, ...]}
 * - fileName, string, 定义文件名
 * - sheetOptions, array, 对应多个sheet设置
 */
const diyExport = (sheets, options = {}) => {
  if (!ExcelJS) {
    ExcelJS = window.ExcelJS
  }
  const workbook = new ExcelJS.Workbook()
  const fileName = options.fileName || 'download.xlsx'
  const fileMergeRules = options.fileMergeRules || 0

  _.forEach(sheets, (sheet, index) => {
    const option = options.sheetOptions[index]
    diyCore(sheet, option, workbook, fileMergeRules)
  })
  exportXlsx(workbook, fileName)
}

const doExportV2 = (sheets, options = {}) => {
  if (!ExcelJS) {
    ExcelJS = window.ExcelJS
  }
  const workbook = new ExcelJS.Workbook()
  const fileName = options.fileName || 'download.xlsx'
  const fileMergeRules = options.fileMergeRules || 0

  _.forEach(sheets, (sheet, index) => {
    const option = options.sheetOptions[index]
    fileMergeRules
      ? exportCoreV2MergerOrder(sheet, option, workbook)
      : exportCoreV2(sheet, option, workbook)
  })
  exportXlsx(workbook, fileName)
}

export { doImport, doExport, doExportV2, diyExport }
