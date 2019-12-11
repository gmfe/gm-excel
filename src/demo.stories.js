import React from 'react'
import { storiesOf } from '@storybook/react'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import _ from 'lodash'

import { getColumns } from './util'

const data = [
  {
    下单日期: '2019-11-07',
    下单时间: '14:37:00',
    出库日期: '2019-11-10',
    收货日期: '2019-11-10',
    运营配置名称: '预售'
  },
  {
    下单日期: '2019-11-07',
    下单时间: '14:37:00',
    出库日期: '2019-11-10',
    收货日期: '2019-11-10',
    运营配置名称: '预售'
  }
]

storiesOf('excel|demo', module).add('default', () => {
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
    worksheet.columns = getColumns(data[0])
    _.forEach(data, item => {
      worksheet.addRow(item).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
    worksheet.mergeCells('A3:B3')
    worksheet.mergeCells(4, 5, 6, 7)
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
  return (
    <button
      onClick={() => {
        write()
      }}
    >
      demo
    </button>
  )
})
