import ExcelJS from 'exceljs'
import _ from 'lodash'
import { diyToSheetCore } from './diy_excel'
import { getSheetArray, getColumns, exportXlsx } from './util'

const sheetToJson = file => {
  return new Promise((resolve, reject) => {
    const workbook = new ExcelJS.Workbook()
    const reader = new window.FileReader()
    const option = { includeEmpty: true }
    reader.readAsArrayBuffer(file)
    reader.onload = data => {
      workbook.xlsx.load(data.target.result).then(() => {
        const xlsxJson = []
        workbook.eachSheet(worksheet => {
          xlsxJson.push({ [worksheet.name]: getSheetArray(worksheet, option) })
        })
        resolve(xlsxJson)
      })
    }
  })
}

const jsonToSheet = (sheets, options = {}) => {
  const workbook = new ExcelJS.Workbook()
  const sheetNames = options.sheetNames || []
  const fileName = options.fileName || 'download.xlsx'
  _.forEach(sheets, (rows, key) => {
    const sheetName = sheetNames[key] || `Sheet${key + 1}`
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = options.columns || getColumns(rows[0])
    worksheet.addRows(rows)
  })
  exportXlsx(workbook, fileName)
}

const diyToSheet = (sheets, options = {}) => {
  const workbook = new ExcelJS.Workbook()
  const fileName = options.fileName || 'download.xlsx'
  diyToSheetCore(sheets, options, workbook)
  exportXlsx(workbook, fileName)
}

export { sheetToJson, jsonToSheet, diyToSheet }
