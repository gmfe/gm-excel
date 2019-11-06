import React from 'react'
import { storiesOf } from '@storybook/react'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'

storiesOf('内部|demo', module).add('default', () => {
  return (
    <button
      onClick={() => {
        test()
      }}
    >
      test
    </button>
  )
})

function test() {
  const workbook = new ExcelJS.Workbook()

  workbook.creator = 'Me'
  workbook.lastModifiedBy = 'Her'
  workbook.created = new Date(1985, 8, 30)
  workbook.modified = new Date()
  workbook.lastPrinted = new Date(2016, 9, 27)

  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
  ]

  const worksheet = workbook.addWorksheet('My Sheet')

  worksheet.columns = [
    { header: 'Id', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 32 },
    { header: 'D.O.B.', key: 'dob', width: 10, outlineLevel: 1 }
  ]

  worksheet.addRow({ id: 1, name: '&BJohn Doe', dob: new Date(1970, 1, 1) })
  worksheet.addRow({ id: 2, name: 'Jane Doe', dob: new Date(1965, 1, 7) })
  worksheet.mergeCells('A4:B5')
  worksheet.getCell('B2').font = {
    bold: true
  }

  workbook.xlsx
    .writeBuffer({
      base64: true
    })
    .then(buffer => {
      console.log(buffer)

      // FileSaver saveAs
      var blob = new window.Blob([buffer], { type: 'application/octet-stream' })
      FileSaver.saveAs(blob, 'test.xlsx')
    })
}
