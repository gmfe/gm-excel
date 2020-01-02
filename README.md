# gm-excel
### 开发
``` bash

yarn 
yarn start

```

### config 类型
```bash
# block
# - {type, id, customer, block: {style, rows : {columns:[]}}}
# - customer表示是否该区域自定义单元格合并大小 size: [x行， y列]表示需要x行y列大小
# - 详细见下例
#
# table
# - {type, id, columns}

# block
# {
#   id: 'mul_block1',
#   type: 'block',
#   customer: true,
#   block: {
#     style: {},
#     rows: [
#       {
#         columns: [
#           {
#             key: 'leibie',
#             size: [1, 2]
#           },
#           {
#             key: 'num'
#           },
#           ....
#         ]
#       }
#     ]
#   }
# }

# table 本质是特殊的block
# {
#   id: 'table1',
#   type: 'table',
#   style: {},
#   columns: [
#     {
#       key: 'fresh',
#       header: '生鲜'
#     },
#     ....
#   ]
# }

```

### 样式及相关字段说明
```bash
#  样式设置说明

#  alignment - 常用：{ horizontal, vertical, wrapText }, 所有单元格默认靠左  
#  - horizontal - 水平分布, string, 常用：{ left, right, center }  
#  - vertical - 垂直分布, string, 常用：{ top, bottom, middle }  
#  - wrapText - 控制单元格文字换行, bool, { true, false }
 
#  border - { top, left, bottom, right } bool, 默认设置 'thin'细线条样式
 
#  font - 常用：{ size, color, bold }
#  - size - 字体大小, number
#  - bold - 粗体展示, bool

# 其它字段说明
 
#  layout - 行分布设置
#  - average, 根据字段均分单元格设置
#  - inOrder, 根据字段及字段值，只合并字段值
#  - all, 独占1行
 
#  style - 可选设置, 表格的表头默认居中, style最终设置由小单元格往大覆盖
#  decisiveColumn - 能够决定整个sheet总列数, bool
#  colWidth -  number, 定义每个单元格宽度
#  rowHeight - number, 定义每行高度
 ```

详见config/config.js config/config_v2.js  

### api
详见代码  

- doExport(sheets, options)  
    -- 通过json数组生成普通表格模板  
    - sheets eg: [[{1:'a',2:'b',3:'c',4:'d'}, {1:'e',2:'f',3:'g',4:'h'}]] 其中key为生成模板头部,且key值必须唯一  
    - options eg: { fileName, sheetNames, columns }  


- doImport(file)     
    -- 解析模板文件，生成json数组 


- diyExport(sheets, options)       
    -- 自定义导出表格模板, 具体见 config 文件夹
    - sheets eg: [{ data, config }, {data, config}, ...]
        - data对应每个sheet数据
        - config为导出单据模板配置, 默认一个sheet内所有单据对应一个模板  
          以{header, content, footer}形式进行配置
    - options eg: {fileName, sheetOptions: [{ sheetName, ...}, ...]}
        - fileName, 定义导出文件名
        - sheetOptions, 对应每个sheet的设置, 如sheet名称等


- doExportV2(sheets, options)     
    -- 自定义导出，模板配置更自由, 具体见 config文件夹
    - sheets eg: [{ data, config }, {data, config}, ...]
        - data对应每个sheet数据
        - config为导出单据模板配置, 默认一个sheet内所有单据对应一个模板  
          以[{type, id, ...}]数组形式进行配置, 按照模板顺序导出，分为 block, table两种形式
    - options eg: {fileName, sheetOptions: [{ sheetName, ...}, ...]}
        - fileName, 定义导出文件名
        - sheetOptions, 对应每个sheet的设置, 如sheet名称等
