import FileSaver from 'file-saver'
import _ from 'lodash'

const getSheetArray = (worksheet, option = { includeEmpty: false }) => {
  const sheet = []
  worksheet.eachRow(option, function(row, rowNumber) {
    // cell.type单元格类型：6-公式 ;2-数值；3-字符串
    const rowArray = []
    row.eachCell(function(cell, colNumber) {
      let value = ''
      if (cell.type === 6) {
        value = cell.result
      } else {
        value = cell.value
      }
      rowArray[colNumber - 1] = value
    })
    sheet[rowNumber - 1] = rowArray
  })
  return sheet
}

const getColumns = (row = {}) => {
  return _.map(row, (value, key) => {
    return {
      header: key,
      key
    }
  })
}

const exportXlsx = (workBook, fileName) => {
  workBook.xlsx
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

export { getSheetArray, getColumns, exportXlsx }
