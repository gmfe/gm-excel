import React, { useRef } from 'react'
import { storiesOf } from '@storybook/react'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'

storiesOf('内部|demo', module).add('default', () => {
  const fileRef = useRef(null)
  const write = () => {
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
        const blob = new window.Blob([buffer], {
          type: 'application/octet-stream'
        })
        FileSaver.saveAs(blob, 'test.xlsx')
      })
  }

  const read = () => {
    const workbook = new ExcelJS.Workbook()
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(fileRef.current.files[0])
    reader.onload = data => {
      console.log(data.target.result)
      workbook.xlsx.load(data.target.result).then(function(wb) {
        console.log(wb)
      })
    }
  }

  return (
    <>
      <button
        onClick={() => {
          write()
        }}
      >
        写
      </button>
      <input
        type='file'
        accept='.xlsx'
        ref={fileRef}
        onChange={() => read()}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => {
          fileRef.current.click()
        }}
      >
        读
      </button>
    </>
  )
})
