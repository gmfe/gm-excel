# gm-excel
### api

- jsonToSheet(sheets, options)  
    通过json数组生成普通表格模板  
    sheets eg: [[{1:'a',2:'b',3:'c',4:'d'}, {1:'e',2:'f',3:'g',4:'h'}]] 其中key为生成模板头部,且key值必须唯一  
    options eg: { fileName, SheetNames, columns }  

- sheetToJson(file)  
    解析模板文件，生成json数组

- diyToSheet