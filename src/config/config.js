/**
 * 样式设置说明
 *
 * alignment - 常用：{ horizontal, vertical, wrapText }, 所有单元格默认靠左
 * - horizontal - 水平分布, string, 常用：{ left, right, center }
 * - vertical - 垂直分布, string, 常用：{ top, bottom, middle }
 * - wrapText - 控制单元格文字换行, bool, { true, false }
 *
 * border - { top, left, bottom, right } bool, 默认设置 'thin'细线条样式
 *
 * font - 常用：{ size, color, bold }
 * - size - 字体大小, number
 * - bold - 粗体展示, bool
 */

/** 其它字段说明
 *
 * layout - 行分布设置
 * - average, 根据字段均分单元格设置
 * - inOrder, 根据字段及字段值，只合并字段值
 * - all, 独占1行
 *
 * style - 可选设置, 表格的表头默认居中, style最终设置由小单元格往大覆盖
 * decisiveColumn - 能够决定整个sheet总列数, bool
 * colWidth -  number, 定义每个单元格宽度
 * rowHeight - number, 定义每行高度
 */

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

const font = { bolc: true }

export const configOne = {
  // colWidth 不定义默认excel单元格宽度
  colWidth: 20,
  // rowheight 不定义默认excel行高
  rowHeight: 10,
  header: {
    title: {
      key: 'name',
      style: {
        border,
        alignment,
        font: {
          size: 16,
          bold: true
        }
      }
    },
    block: {
      style: { border, font },
      rows: [
        {
          columns: [
            {
              key: 'sendData'
            },
            {
              key: 'sendCode'
            },
            {
              key: 'page',
              style: {
                alignment: alignmentRight
              }
            }
          ],
          layout: 'average'
        },
        {
          columns: [
            {
              key: '_dishNum',
              style: { alignment }
            },
            {
              key: 'dishNum',
              style: {
                alignment: alignmentLeft
              }
            },
            {
              key: '_receiveAddress',
              style: { alignment }
            },
            {
              key: 'receiveAddress',
              style: {
                alignment: alignmentLeft
              }
            }
          ],
          layout: 'inOrder'
        },
        {
          columns: [
            {
              key: '_sendAddress',
              style: { alignment }
            },
            {
              key: 'sendAddress'
            },
            {
              key: '_no',
              style: { alignment }
            },
            {
              key: 'no'
            }
          ],
          layout: 'inOrder',
          style: {
            alignment: alignmentLeft
          }
        }
      ]
    }
  },
  content: [
    {
      id: 'table1',
      type: 'table',
      decisiveColumn: true,
      // 若有，设置整个表格的边框、字体粗细问题
      style: { border },
      columns: [
        {
          key: 'code',
          header: '编码',
          // 对应为该字段整列的设置
          style: { alignment }
        },
        {
          key: 'dishName',
          header: '菜名'
        },
        {
          key: 'orderNum',
          header: '预定数'
        },
        {
          key: 'sendNum',
          header: '配送数',
          style: {
            alignment: alignmentRight
          }
        },
        {
          key: 'recNum',
          header: '实收数',
          style: {
            alignment: alignmentRight
          }
        },
        {
          key: 'unit_price',
          header: '单价'
        },
        {
          key: 'price',
          header: '金额'
        },
        {
          key: 'remark',
          header: '备注'
        }
      ]
    },
    {
      id: 'block1',
      type: 'block',
      block: {
        style: { border },
        rows: [
          {
            columns: [
              {
                key: 'sum'
              },
              {
                key: 'sum_price'
              }
            ],
            layout: 'average'
          }
        ]
      }
    }
  ],
  footer: {
    block: {
      style: { border },
      rows: [
        {
          columns: [
            {
              key: 'sendAdd'
            },
            {
              key: 'recAdd'
            }
          ],
          layout: 'average'
        },
        {
          columns: [
            {
              key: 'sendPerson'
            },
            {
              key: 'recPerson'
            }
          ],
          layout: 'average'
        }
      ]
    }
  }
}

export const configTwo = {
  colWidth: 15,
  header: {
    title: {
      key: 'name',
      style: {
        border,
        alignment,
        font: {
          size: 16,
          bold: true
        }
      }
    },
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
  content: [
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
    }
  ],
  footer: {
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
  }
}
