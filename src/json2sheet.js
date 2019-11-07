import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import _ from 'lodash'
import { getColumns } from './util'

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
  workbook.xlsx
    .writeBuffer({
      base64: true
    })
    .then(buffer => {
      const blob = new window.Blob([buffer], {
        type: 'application/octet-stream'
      })
      FileSaver.saveAs(blob, fileName.replace(/[<>\\:;?/*|]/g, '-'))
    })
}

export { jsonToSheet }
