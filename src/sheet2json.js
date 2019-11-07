import ExcelJS from 'exceljs'
import { getSheetArray } from './util'

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

export { sheetToJson }
