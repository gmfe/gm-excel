import _ from 'lodash'

const _getBorderStyle = l => {
  if (l) {
    return { style: 'thin' }
  }
  return {}
}

const getBorderStyle = border => {
  const { top, left, bottom, right } = border
  return {
    top: _getBorderStyle(top),
    left: _getBorderStyle(left),
    bottom: _getBorderStyle(bottom),
    right: _getBorderStyle(right)
  }
}

const setCellStyle = (cell, style) => {
  if (style.border) {
    cell.border = getBorderStyle(style.border)
  }
  cell.alignment = style.alignment || {}
  cell.font = style.font || {}
}

/**
 * from - 起始单元格
 * size - 占据的行数, 列数
 */
const mergeCells = (from, size, worksheet) => {
  const top = from.row
  const left = from.column
  const bottom = from.row + size.row - 1
  const right = from.column + size.column - 1
  worksheet.mergeCells(top, left, bottom, right)
}

// 处理合并单元格
const diyToSheetMergeCells = (row, sheetColumns, type, worksheet) => {
  const { data, fieldNum, rowIndex, mergeCellNum, rowStyle } = row
  let column = 0
  _.forEach(data, (item, index) => {
    column++
    let isMerge = 1
    let lastMergeColumnNum = 0
    // inOrder插入时, 只有字段值所在单元格进行合并, average插入时, 每个字段都需进行合并操作
    if (type !== 'average') {
      isMerge = index % 2
    }

    if (isMerge) {
      if (type === 'average') {
        // average -- 第n列 = 前m个字段 * 合并单元格数
        column = index * mergeCellNum + 1
        // 记录不均等时的最后合并个数
        lastMergeColumnNum = sheetColumns - (fieldNum - 1) * mergeCellNum
      } else {
        // inOrder -- 第n列 = 前n个字段 / 2 * 每两个字段所需单元格 + 1（该字段值前面的字段名占据一个单元格）
        column = ((index - 1) / 2) * (mergeCellNum + 1) + 2
        lastMergeColumnNum =
          sheetColumns - (fieldNum - 1) * mergeCellNum - fieldNum
      }

      const from = { row: rowIndex, column }
      let size = { row: 1, column: mergeCellNum }

      // 出现不均分情况，暂时在最后一个处理
      if (index === data.length - 1) {
        size = {
          ...size,
          column: lastMergeColumnNum
        }
      }

      // 插入空单元格进行合并, 不影响插入的数据
      if (column <= sheetColumns) {
        const nowRow = worksheet.getRow(rowIndex)
        const arr = new Array(size.column > 0 ? size.column - 1 : 0).fill('')
        nowRow.splice(column + 1, 0, ...arr)
      }
      mergeCells(from, size, worksheet)
    }

    // 自定义独立样式
    const cell = worksheet.getRow(rowIndex).getCell(column)
    if (item.style) {
      setCellStyle(cell, item.style)
    }

    if (!item.style && rowStyle) {
      setCellStyle(cell, rowStyle)
    }

    if (isMerge) {
      column += mergeCellNum - 1
    }
  })
}

/** 自定义单元格合并
 * 根据设定的size[占据行, 占据列]的大小进行合并
 */
const diyCustomToSheetMergeCells = (rowIndex, rowKeys, worksheet) => {
  let column = 1
  _.forEach(rowKeys, item => {
    if (item.size) {
      const needRows = item.size[0]
      const needCols = item.size[1]

      if (needCols > 1) {
        const arr = new Array(needCols - 1).fill('')
        let _row = 1
        let _rowIndex = rowIndex
        while (_row <= needRows) {
          worksheet.getRow(_rowIndex).splice(column + 1, 0, ...arr)
          _row++
          _rowIndex++
        }
      }

      const bottom = rowIndex + needRows - 1
      const right = column + needCols - 1
      worksheet.mergeCells(rowIndex, column, bottom, right)
      column = column + needCols
    } else {
      column++
    }
  })
}

export {
  mergeCells,
  setCellStyle,
  getBorderStyle,
  diyToSheetMergeCells,
  diyCustomToSheetMergeCells
}
