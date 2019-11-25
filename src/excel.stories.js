import React, { useRef } from 'react'
import { storiesOf } from '@storybook/react'

import { doImport, doExport, diyExport } from './index'
import { configOne, configTwo } from './config/config'
import { dataOne, dataTwo } from './config/data'

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

storiesOf('excel|common', module)
  .add('default', () => {
    const fileRef = useRef(null)
    const write = () => {
      doExport([data], {
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
      doImport(fileRef.current.files[0]).then(json => {
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
  .add('diy', () => {
    const diy = () => {
      diyExport(
        [
          { config: configOne, sheetDatas: [dataOne, dataOne, dataOne] },
          { config: configTwo, sheetDatas: [dataTwo] }
        ],
        {
          fileName: 'diy_excel.xlsx',
          sheetOptions: [{ sheetName: 'A sheet' }, { sheetName: 'B sheet' }]
        }
      )
    }

    return (
      <>
        <button onClick={() => diy()}>diy export</button>
      </>
    )
  })
