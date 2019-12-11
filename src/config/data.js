export const dataOne = {
  common: {
    name: '送菜清单',
    sendData: '送菜日期：2019年11月05日',
    sendCode: '送货单号：M999201911040021.',
    page: '共2页 第2页',
    _dishNum: '配菜编号',
    dishNum: '',
    _receiveAddress: '收货单位',
    receiveAddress: '0017.武警 (揭东中队)',
    _sendAddress: '送货地址',
    sendAddress: '',
    _no: 'Ac.No',
    no: '0017191104162124',
    sendAdd: '送货单位：揭阳望家欢',
    recAdd: '收货单位：武警',
    sendPerson: '送货人签字：',
    recPerson: '收货人签字：'
  },
  table: [
    {
      id: 'table1',
      columns: [
        {
          code: '903376',
          dishName: '杨桃 斤',
          orderNum: '7.00斤',
          sendNum: '斤',
          recNum: '斤',
          unit_price: '5.00',
          price: '',
          remark: ''
        },
        {
          code: '904720',
          dishName: '香瓜 斤',
          orderNum: '8.00斤',
          sendNum: '斤',
          recNum: '斤',
          unit_price: '3.13',
          price: '',
          remark: ''
        }
      ]
    }
  ],
  block: [
    {
      id: 'block1',
      columns: [
        {
          sum: '总金额<大写：>  零整',
          sum_price: '1'
        }
      ]
    }
  ]
}

export const dataTwo = {
  common: {
    name: '观麦送菜',
    service_tel: '客服电话：13687988976',
    order_date: '下单日期：2019/11/3 19:13:51',
    delivery_date: '配送：11 - 04 07: 00 ~ 11 - 04 08: 00',
    print_date: '打印日期：2019/11/4 15:59:58',
    transfer_no: '流转单号：PL10151697',
    order_no: '订单编号：',
    number: '序号：170',
    rec_address: '收货商户：lrk353(80689)',
    recever: '收货人：王',
    tel: '联系电话：13033733089',
    is_void: '',
    address: '地址：青云谱镇|南昌市青云谱区博学路',
    order_price: '下单金额：',
    out_stock_price: '出库金额：',
    freight: '运费：',
    abnormal_price: '异常金额',
    real_price: '应付：',
    text: '当天服务时间下午18:00之前',
    out_stock: '出库签字：',
    delivery: '配送签字：',
    customer: '客户签字：'
  },
  table: [
    {
      id: 'table1',
      columns: [
        {
          fresh: 4,
          vegetable: 8,
          meat: 1,
          spices: 1,
          frozen_goods: 1
        }
      ]
    },
    {
      id: 'table2',
      columns: [
        {
          num: 1,
          category: '生鲜',
          sku_name: '纯鸡丁',
          spec: '-',
          order_num: 3,
          real_num: '3斤',
          unit_price: 18,
          sum: 54,
          remark: ''
        },
        {
          num: 2,
          category: '生鲜',
          sku_name: '雄鱼',
          spec: '-',
          order_num: 6,
          real_num: '6.5斤',
          unit_price: 10,
          sum: 65,
          remark: '杀好，鱼鳞刮干净，黑色的弄掉'
        },
        {
          num: 3,
          category: '生鲜',
          sku_name: '拌好鸡胗',
          spec: '-',
          order_num: 4,
          real_num: '4斤',
          unit_price: 23,
          sum: 92,
          remark: ''
        }
      ]
    },
    {
      id: 'table3',
      columns: [
        {
          num: 4,
          category: '蔬菜',
          sku_name: '青皮冬瓜',
          spec: '-',
          order_num: 5,
          real_num: '6斤',
          unit_price: 3,
          sum: 18,
          remark: ''
        },
        {
          num: 5,
          category: '蔬菜',
          sku_name: '青尖椒',
          spec: '-',
          order_num: 4,
          real_num: '4斤',
          unit_price: 4.3,
          sum: 17.2,
          remark: ''
        }
      ]
    }
  ],
  block: [
    {
      id: 'block2',
      columns: [
        {
          one_sum: '小计',
          one_money: 100
        }
      ]
    },
    {
      id: 'block3',
      columns: [
        {
          one_sum: '小计',
          one_money: 100
        }
      ]
    },
    {
      id: 'block4',
      columns: [
        {
          detail: '销售明细'
        }
      ]
    }
  ]
}
