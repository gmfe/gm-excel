const alignment = {
  horizontal: 'center',
  vertical: 'middle'
}

const alignmentLeft = {
  horizontal: 'left',
  vertical: 'middle'
}

const alignmentRight = {
  horizontal: 'right',
  vertical: 'middle'
}

const border = {
  top: true,
  left: true,
  bottom: true,
  right: true
}

/**
 * [{}, {}]
 * type -- 'style', 'block', 'table'
 * - style为全局style, 用于设置列宽与行高，会设置于于每个单元格
 *
 * style
 * - {type, colWidth, rowHeight}
 *
 * block
 * - {type, id, block: {style, rows : {columns:[]}}}
 * - custome表示是否该区域自定义单元格合并大小
 * - 详细见下例
 *
 * table
 * - {type, id, columns}
 */

export const configV2 = [
  {
    type: 'style',
    colWidth: 15,
    rowHeight: 20
  },
  {
    type: 'block',
    id: 'title',
    custome: true,
    block: {
      style: {
        border,
        alignment,
        font: {
          size: 16,
          bold: true
        }
      },
      rows: [
        {
          columns: [
            {
              key: 'name',
              size: [2, 9]
            }
          ]
        }
      ]
    }
  },
  {
    type: 'block',
    id: 'block6',
    block: {
      style: {
        border,
        alignment: alignmentLeft
      },
      rows: [
        {
          columns: [
            {
              key: 'service_tel'
            }
          ],
          layout: 'all',
          style: {
            border,
            alignment: alignmentRight
          }
        },
        {
          columns: [
            {
              key: 'order_date'
            },
            {
              key: 'delivery_date'
            },
            {
              key: 'print_date'
            }
          ],
          layout: 'average'
        },
        {
          columns: [
            {
              key: 'transfer_no'
            },
            {
              key: 'order_no'
            },
            {
              key: 'number'
            }
          ],
          layout: 'average'
        },
        {
          columns: [
            {
              key: 'rec_address'
            }
          ],
          layout: 'all'
        },
        {
          columns: [
            {
              key: 'recever'
            },
            {
              key: 'tel'
            },
            {
              key: 'is_void'
            }
          ],
          layout: 'average'
        },
        {
          columns: [
            {
              key: 'address'
            }
          ],
          layout: 'all'
        }
      ]
    }
  },
  {
    id: 'block1',
    type: 'block',
    block: { rows: [] }
  },
  {
    id: 'table1',
    type: 'table',
    style: {
      border,
      alignment: alignmentLeft
    },
    columns: [
      {
        key: 'fresh',
        header: '生鲜'
      },
      {
        key: 'vegetable',
        header: '蔬菜'
      },
      {
        key: 'meat',
        header: '肉禽蛋'
      },
      {
        key: 'spices',
        header: '调味品'
      },
      {
        key: 'frozen_goods',
        header: '冻品'
      }
    ]
  },
  {
    id: 'block1',
    type: 'block',
    block: { rows: [] }
  },
  {
    id: 'block4',
    type: 'block',
    block: {
      style: {
        border,
        alignment: alignmentLeft
      },
      rows: [
        {
          columns: [
            {
              key: 'detail'
            }
          ],
          layout: 'all'
        }
      ]
    }
  },
  {
    id: 'table2',
    type: 'table',
    decisiveColumn: true,
    style: {
      border
    },
    columns: [
      {
        key: 'num',
        header: '序号'
      },
      {
        key: 'category',
        header: '品类'
      },
      {
        key: 'sku_name',
        header: '商品名'
      },
      {
        key: 'spec',
        header: '规格'
      },
      {
        key: 'order_num',
        header: '下单'
      },
      {
        key: 'real_num',
        header: '实配'
      },
      {
        key: 'unit_price',
        header: '单价'
      },
      {
        key: 'sum',
        header: '应付金额'
      },
      {
        key: 'remark',
        header: '备注',
        style: {
          alignment: {
            wrapText: true
          }
        }
      }
    ]
  },
  {
    id: 'block2',
    type: 'block',
    block: {
      style: {
        border,
        alignment: alignmentLeft
      },
      rows: [
        {
          columns: [
            {
              key: 'one_sum'
            },
            {
              key: 'one_money'
            }
          ],
          layout: 'average'
        }
      ]
    }
  },
  {
    id: 'table3',
    type: 'table',
    disabledHeaderRow: true,
    style: {
      border
    },
    columns: [
      {
        key: 'num',
        header: '序号'
      },
      {
        key: 'category',
        header: '品类'
      },
      {
        key: 'sku_name',
        header: '商品名'
      },
      {
        key: 'spec',
        header: '规格'
      },
      {
        key: 'order_num',
        header: '下单'
      },
      {
        key: 'real_num',
        header: '实配'
      },
      {
        key: 'unit_price',
        header: '单价'
      },
      {
        key: 'sum',
        header: '应付金额'
      },
      {
        key: 'remark',
        header: '备注'
      }
    ]
  },
  {
    id: 'block3',
    type: 'block',
    block: {
      style: {
        border,
        alignment: alignmentLeft
      },
      rows: [
        {
          columns: [
            {
              key: 'one_sum'
            },
            {
              key: 'one_money'
            }
          ],
          layout: 'average'
        }
      ]
    }
  },
  {
    type: 'block',
    id: 'block7',
    block: {
      style: {
        border,
        alignment: alignmentLeft
      },
      rows: [
        {
          columns: [
            {
              key: 'order_price'
            },
            {
              key: 'out_stock_price'
            },
            {
              key: 'freight'
            },
            {
              key: 'abnormal_price'
            },
            {
              key: 'real_price'
            }
          ],
          layout: 'average'
        },
        {
          columns: [
            {
              key: 'text'
            }
          ],
          layout: 'all'
        },
        {
          columns: [
            {
              key: 'out_stock'
            },
            {
              key: 'delivery'
            },
            {
              key: 'customer'
            }
          ],
          layout: 'average'
        }
      ]
    }
  },
  {
    id: 'block1',
    type: 'block',
    block: { rows: [] }
  },
  {
    id: 'mul_block',
    type: 'block',
    custome: true,
    block: {
      style: {
        border,
        alignment
      },
      rows: [
        {
          columns: [
            {
              key: 'leibie',
              size: [4, 1]
            },
            {
              key: 'num'
            },
            {
              key: 'sku_name',
              size: [2, 1]
            },
            // {
            //   key: 'order_num'
            // },
            {
              key: 'real_num'
            },
            {
              key: 'unit_price',
              size: [4, 2]
            },
            {
              key: 'sum'
            },
            {
              key: 'remark'
            },
            {
              key: 'all',
              size: [4, 1]
            }
          ]
        }
      ]
    }
  }
]
