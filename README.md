# gm-excel
### api

- doImport(sheets, options)  
    -- 通过json数组生成普通表格模板  
    - sheets eg: [[{1:'a',2:'b',3:'c',4:'d'}, {1:'e',2:'f',3:'g',4:'h'}]] 其中key为生成模板头部,且key值必须唯一  
    - options eg: { fileName, SheetNames, columns }  

- doExport(file) 
    -- 解析模板文件，生成json数组

- diyExport(sheets, options)
    -- 自定义导出表格模板
    - sheets eg: [{ data, config }, {data, config}, ...]
        - data对应每个sheet数据
        - config为导出单据模板配置, 暂时默认一个sheet内所有单据对应一个模板
    - options eg: {fileName, sheetOptions: [{ sheetName, ...}, ...]}
        - fileName, 定义导出文件名
        - sheetOptions, 对应每个sheet的设置, 如sheet名称等
