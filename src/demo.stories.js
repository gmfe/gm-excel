import React, { useRef } from 'react'
import { storiesOf } from '@storybook/react'
import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
import _ from 'lodash'

import { sheetToJson, jsonToSheet } from './index'
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

storiesOf('excel|common', module).add('default', () => {
  const fileRef = useRef(null)
  const write = () => {
    jsonToSheet([data], {
      sheetNames: ['订单'],
      columns: [
        {
          header: '下单日期',
          key: '下单日期',
          width: 15
        },
        {
          header: '下单时间',
          key: '下单时间',
          width: 15
        },
        {
          header: '出库日期',
          key: '出库日期',
          width: 15
        },
        {
          header: '收货日期',
          key: '收货日期',
          width: 15
        },
        {
          header: '运营配置',
          key: '运营配置名称',
          width: 20
        }
      ],
      fileName: 'demo.xlsx'
    })
  }

  const read = () => {
    sheetToJson(fileRef.current.files[0]).then(json => {
      console.log(json)
    })
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
