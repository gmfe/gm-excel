import _ from 'lodash'
import { getColumns } from '../util'

const getSheetColumns = content => {
  const table = _.find(
    content,
    item => item.type === 'table' && item.decisiveColumn
  )

  if (!table) {
    Promise.reject(new Error('table need decisiveColumn'))
  }
  return table.columns.length
}

const getColumnLength = content => {
  let len = 1
  _.each(content, temp => {
    if (temp.type === 'table') {
      if (temp.columns.length > len) {
        len = temp.columns.length
      }
    } else if (temp.type === 'block') {
      _.each(temp.block.rows, row => {
        if (row.columns.length > len) {
          len = row.columns.length
        }
      })
    }
  })
  return len
}

const diyToSheetRowHeight = (worksheet, rowHeight) => {
  const sheetRows = worksheet.rowCount
  let columnIndex = 1
  while (columnIndex < sheetRows) {
    const row = worksheet.getRow(columnIndex)
    row.height = rowHeight
    columnIndex++
  }
}

const diyToSheetColWidth = (worksheet, colWidth) => {
  const sheetColumns = worksheet.columnCount
  let columnIndex = 1
  while (columnIndex <= sheetColumns) {
    const col = worksheet.getColumn(columnIndex)
    col.width = colWidth
    columnIndex++
  }
}

// 取单元格展示文本：兼容富文本、超链接、公式结果等对象形式的单元格值
const getCellDisplayText = value => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    if (Array.isArray(value.richText)) return value.richText.map(item => item.text || '').join('')
    if (value.text !== undefined) return String(value.text)
    if (value.result !== undefined) return String(value.result)
  }
  return String(value)
}

// 估算文本显示宽度：CJK 全角字符按 2 计，其余按 1 计
// 注意用 for...of 按 Unicode 码点遍历（emoji 等代理对字符按 1 个全角字符计），与 split('') 行为一致
const getTextWidth = text => {
  let width = 0
  for (const char of text) {
    width += char.charCodeAt(0) > 255 ? 2 : 1
  }
  return width
}

// 列字母转列号：A -> 1, B -> 2, ..., AA -> 27
const columnLetterToNumber = letters =>
  letters.split('').reduce((num, letter) => num * 26 + letter.charCodeAt(0) - 64, 0)

// 按各列单元格内容的最大显示宽度自适应列宽
// 合并单元格的文本宽度按跨列数均摊，避免整行合并的长文本把每列都撑成文本全长
const diyToSheetAutoColWidth = worksheet => {
  // 合并区域映射：主格地址 -> 跨列数，如 'A2' -> 12
  const mergeSpanMap = {}
  _.forEach(worksheet.model.merges || [], range => {
    const match = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/)
    if (!match) return
    const startCol = columnLetterToNumber(match[1])
    const endCol = columnLetterToNumber(match[3])
    mergeSpanMap[`${match[1]}${match[2]}`] = endCol - startCol + 1
  })

  // 每列当前最大宽度，下标为列号
  const maxWidths = []
  // 单遍行遍历整张表，逐格累计每列最大值，避免按列 × 全表行重复扫描
  worksheet.eachRow({ includeEmpty: false }, row => {
    row.eachCell({ includeEmpty: false }, cell => {
      // 跳过合并从格（从格共享主格的值，重复计入会把合并文本宽度算到每一列）
      // 注意不能用 isMerged 判断：exceljs 中主格的 isMerged 也是 true，master === 自身才是主格/普通格
      if (cell.master !== cell) return
      const text = getCellDisplayText(cell.value)
      if (!text) return
      // 合并主格：宽度按跨列数均摊；普通格：全额计入
      const span = mergeSpanMap[cell.address] || 1
      const col = cell.col
      const current = maxWidths[col] || 0
      // 剪枝：文本宽度上限为 2 × 字符数（全角），均摊后仍不超当前最大值的格跳过逐字符计算
      if (Math.ceil((text.length * 2) / span) <= current) return
      const lines = text.split(/\r?\n/)
      const textWidth = Math.max(...lines.map(getTextWidth))
      maxWidths[col] = Math.max(current, Math.ceil(textWidth / span))
    })
  })

  for (let columnIndex = 1; columnIndex <= worksheet.columnCount; columnIndex++) {
    const column = worksheet.getColumn(columnIndex)
    const width = maxWidths[columnIndex]
    if (width > 0) column.width = width + 2
  }
}

const exportSample = (sheets, options, workbook) => {
  const sheetNames = options.sheetNames || []
  _.forEach(sheets, (sheet, key) => {
    const sheetName = sheetNames[key] || `Sheet${key + 1}`
    const worksheet = workbook.addWorksheet(sheetName)
    worksheet.columns = options.columns || getColumns(sheet[0])
    worksheet.addRows(sheet)
  })
}

const setSheetRowFill = fillData => {
  const { fromIndex, sheetColumns, worksheet, needFill } = fillData
  worksheet.mergeCells(fromIndex, 1, fromIndex, sheetColumns)
  const cell = worksheet.getRow(fromIndex).getCell(1)
  cell.fill = needFill.fill
}

export {
  getColumnLength,
  getSheetColumns,
  diyToSheetRowHeight,
  diyToSheetColWidth,
  diyToSheetAutoColWidth,
  exportSample,
  setSheetRowFill
}
