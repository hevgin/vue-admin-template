/**
 * Created by PanJiaChen on 16/11/18.
 */
import fecha from 'element-ui/src/utils/date'
import store from '@/store'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
* 触发浏览器下载文件
* @param  {Blob} blob 文件对象
* @param  {string} fileName 文件名
*/
export function saveBlob(blob, fileName) {
  const a = document.createElement('a')
  a.style = 'display:none;'
  document.body.appendChild(a)
  const fileUrl = window.URL.createObjectURL(blob)
  a.href = fileUrl
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(fileUrl)
  document.body.removeChild(a)
}

/**
* 解析日期字条串为日期对象
* @param  {string} str 日期字符串
* @param  {string} fmt 日期格式
* @return {obj} 日期对象
*/
export function parseDate(str, fmt) {
  return fecha.parse(str, fmt)
}

/**
 * 按指定的格式掩码格式化日期对象
 * @param {*} dateObj 日期对象
 * @param {*} mask 日期格式掩码
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(dateObj, mask) {
  return fecha.format(dateObj, mask)
}

/**
 * 计算指定日期添加若干天后的日期
 * @param {*} dateObj 需要添加天数的日期
 * @param {*} days 需要添加的天数
 * @return {obj} 日期对象
 */
export function calcuDateAfterDays(dateObj, days = 0, include = true) {
  if (days === 0) {
    return dateObj
  }
  const sign = Math.sign(days)
  days = Math.abs(days)
  const startDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0)
  const perDayMilliSeconds = 24 * 60 * 60 * 1000
  const addDaysMilliSeconds = (include ? days : (days - 1)) * perDayMilliSeconds
  const endDate = new Date(startDate.getTime() + sign * addDaysMilliSeconds)
  return endDate
}

/**
* 获取字典字段数据
* @param  {str} dictName 字段名称
* @param  {any} val  字典字段的值
* @param  {key} key  字典字段名称
* @return {obj/str} data key!=='value' 返回item, 否则返回label
*/
export function getDictData(dictName, val, key = 'value') {
  const list = store.getters.dict[`${dictName}`] || []
  const data = list.filter(item => {
    return item[`${key}`] === val
  })
  if (data.length > 0) {
    return data[0].label || data[0]
  }
  return ''
}

/**
* 日期快捷选择配置
* @time 2022-05-24 10:15:09
*/
export function datepickerShortcuts() {
  return [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近两周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近两月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近半年',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一年',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
      picker.$emit('pick', [start, end])
    }
  }]
}
