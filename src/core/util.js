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
    if (Array.isArray(value.richText))
      return value.richText.map(item => item.text || '').join('')
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
  letters
    .split('')
    .reduce((num, letter) => num * 26 + letter.charCodeAt(0) - 64, 0)

// 跨全列合并格自适应行高时每行文本占用的行高，与渲染侧默认行高保持一致
const AUTO_COL_WIDTH_LINE_HEIGHT = 20

// Excel 默认正文字号；列宽单位即该字号下的字符数
const DEFAULT_FONT_SIZE = 11

// 取单元格字号：无 font 或未设 size 时按默认字号处理
const getCellFontSize = cell => {
  const size = cell.font && cell.font.size
  return size > 0 ? size : DEFAULT_FONT_SIZE
}

/**
 * 按各列单元格内容的最大显示宽度自适应列宽（默认字号感知）。
 *
 * 字号感知：列宽单位是默认字号（11pt）下的字符数，单元格字号放大后同样文本
 * 实际占宽按 size/11 比例放大，估宽同步缩放，避免大字号文本被截断/挤压换行；
 * 字号 ≤11 时缩放系数为 1，与旧算法结果完全一致。
 *
 * 传 { ignoreFont: true } 关闭字号感知，退回旧的纯字符计数算法
 * （调用方 options.autoColWidthIgnoreFont，用于保持旧导出的列宽表现）。
 *
 * 合并单元格分两类处理：
 * - 跨全列合并（标题行、底部备注区）：不参与列宽计算，改为开启 wrapText 换行 + 按折行数撑高行高，
 *   避免长文本均摊把序号等窄列撑得过宽（旧版均摊算法的副作用）
 * - 普通合并（跨部分列，如"订单号"跨 2 列）：保证合并区域总宽 ≥ 文本宽，差额均摊补到区域各列，
 *   避免均摊值只落在起始列导致区域总宽不足、文本被截断（旧版均摊算法的缺陷）
 */
const diyToSheetAutoColWidth = (worksheet, { ignoreFont = false } = {}) => {
  // 字号 → 估宽缩放系数：小于默认字号不缩窄（避免存量缩小字号场景列宽变窄），ignoreFont 时恒为 1
  const fontScaleOf = cell =>
    ignoreFont
      ? 1
      : Math.max(getCellFontSize(cell), DEFAULT_FONT_SIZE) / DEFAULT_FONT_SIZE

  const totalColumns = worksheet.columnCount
  // 合并区域映射：主格地址 -> { span 跨列数, startCol 起始列号 }
  const mergeInfoMap = {}
  _.forEach(worksheet.model.merges || [], range => {
    const match = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/)
    if (!match) return
    const startCol = columnLetterToNumber(match[1])
    const endCol = columnLetterToNumber(match[3])
    mergeInfoMap[`${match[1]}${match[2]}`] = {
      span: endCol - startCol + 1,
      startCol
    }
  })

  // 每列当前最大宽度，下标为列号
  const maxWidths = []
  // 合并主格缓存，待普通格列宽定下来后再统一处理（保总量/换行依赖普通格产出的列宽）
  const mergedCells = []
  // 单遍行遍历整张表：普通格累计每列最大值；合并主格只缓存不计数
  worksheet.eachRow({ includeEmpty: false }, row => {
    row.eachCell({ includeEmpty: false }, cell => {
      // 跳过合并从格（从格共享主格的值，重复计入会把合并文本宽度算到每一列）
      // 注意不能用 isMerged 判断：exceljs 中主格的 isMerged 也是 true，master === 自身才是主格/普通格
      if (cell.master !== cell) return
      const text = getCellDisplayText(cell.value)
      if (!text) return
      const mergeInfo = mergeInfoMap[cell.address]
      if (mergeInfo) {
        mergedCells.push({ cell, text, ...mergeInfo })
        return
      }
      const col = cell.col
      const current = maxWidths[col] || 0
      const scale = fontScaleOf(cell)
      // 剪枝：文本宽度上限为 2 × 字符数（全角）× 字号系数，不超当前最大值的格跳过逐字符计算
      if (Math.ceil(text.length * 2 * scale) <= current) return
      const lines = text.split(/\r?\n/)
      // 估宽按字号系数放大后向上取整，保证放大字号下列宽不低于实际文本占宽
      const textWidth = Math.ceil(Math.max(...lines.map(getTextWidth)) * scale)
      maxWidths[col] = Math.max(current, textWidth)
    })
  })

  // 先按普通格内容应用列宽（+2 余量），无内容的列不设置宽度
  for (let columnIndex = 1; columnIndex <= totalColumns; columnIndex++) {
    const width = maxWidths[columnIndex]
    if (width > 0) worksheet.getColumn(columnIndex).width = width + 2
  }

  // 再处理合并主格（按行序，前面区域的补宽会计入后面区域的现有总宽）
  _.forEach(mergedCells, ({ cell, text, span, startCol }) => {
    // 主格字号系数：折行与补宽计算都按主格字号缩放
    const scale = fontScaleOf(cell)
    // 跨全列合并格：不参与列宽计算，开启自动换行并按折行后的行数撑高行高
    if (span >= totalColumns) {
      // 区域可用显示宽度（列宽含 2 的余量，粗略扣掉单侧余量）
      let regionWidth = 0
      for (let col = startCol; col < startCol + span; col++) {
        regionWidth += worksheet.getColumn(col).width || 0
      }
      const usableWidth = Math.max(regionWidth - 2, 1)
      // 每行文本超过区域宽度时 wrapText 会折行，按折行后的总行数计算行高（文本宽按字号缩放）
      const lines = text.split(/\r?\n/)
      const displayLineCount = lines.reduce(
        (count, line) =>
          count +
          Math.max(1, Math.ceil((getTextWidth(line) * scale) / usableWidth)),
        0
      )
      cell.alignment = { ...cell.alignment, wrapText: true }
      // 每行行高不低于字号 × 1.35（与渲染侧 bumpRowHeightByFont 口径一致），默认 20；
      // ignoreFont 完全退回旧行为：行高恒为默认 20
      const lineHeight = ignoreFont
        ? AUTO_COL_WIDTH_LINE_HEIGHT
        : Math.max(AUTO_COL_WIDTH_LINE_HEIGHT, getCellFontSize(cell) * 1.35)
      const row = worksheet.getRow(cell.row)
      row.height = Math.max(row.height || 0, displayLineCount * lineHeight)
      return
    }
    // 普通合并格：保证区域总宽 ≥ 最宽行文本宽（按字号缩放）+ 2，差额均摊补到区域各列（余数补起始列）
    const lines = text.split(/\r?\n/)
    const textWidth = Math.ceil(Math.max(...lines.map(getTextWidth)) * scale)
    let regionWidth = 0
    for (let col = startCol; col < startCol + span; col++) {
      regionWidth += worksheet.getColumn(col).width || 0
    }
    const deficit = textWidth + 2 - regionWidth
    if (deficit <= 0) return
    const share = Math.floor(deficit / span)
    for (let col = startCol; col < startCol + span; col++) {
      const extra = share + (col === startCol ? deficit - share * span : 0)
      worksheet.getColumn(col).width =
        (worksheet.getColumn(col).width || 0) + extra
    }
  })
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
