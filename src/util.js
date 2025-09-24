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

// 获取blob对象
const getBlob = async (workBook) => {
  const buffer = await workBook.xlsx.writeBuffer({
    base64: true
  })
  const blob = new window.Blob([buffer], {
    type: 'application/octet-stream'
  })
  return blob
}

// 导出blob对象（参数和exportXlsx一样，但返回blob）
const exportXlsxToBlob = (workBook, fileName) => {
  return workBook.xlsx
    .writeBuffer({
      base64: true
    })
    .then(buffer => {
      const blob = new window.Blob([buffer], {
        type: 'application/octet-stream'
      })
      return blob
    })
}

export { getSheetArray, getColumns, exportXlsx, getBlob, exportXlsxToBlob }
