import { getAntdMessage } from '@/utils/antdMessage'

/**
 * 根据参数名称获取 URL 上的参数值
 * @param name 参数名称
 * @returns 参数值，如果不存在返回 null 或空字符串
 */
export const getParam = (name: string) => {
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[#?&]" + name + "(=([^&]*)|&|$)"),
    results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * 获取两个数组中不同的元素
 * @param arr1 数组 1
 * @param arr2 数组 2
 * @returns 包含两个数组中不重复元素的数组
 */
export const getDiff = (arr1: any[], arr2: any[]) => {
  return arr1
    .concat(arr2)
    .filter((item, index, arr) => arr.indexOf(item) === arr.lastIndexOf(item));
};

/**
 * 表格时间格式化
 * @param cellValue 时间值（字符串、数字或 Date 对象）
 * @returns 格式化后的时间字符串 (YYYY-MM-DD HH:mm:ss)
 */
export function formatDate(cellValue: string | number | Date) {
  if (cellValue == null || cellValue === "") {
    return "";
  }
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
}

/**
 * Base64 图片转 File 对象
 * @param base64 Base64 字符串
 * @param fileName 生成的文件名
 * @returns File 对象
 */
export function base64ToFile(base64: string, fileName: string) {
  if (!base64) return;
  // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
  let data: any = base64.split(",");
  // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
  let type = data[0].match(/:(.*?);/)[1];
  // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
  let suffix = type.split("/")[1];
  // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
  const bstr = window.atob(data[1]);
  // 获取解码结果字符串的长度
  let n = bstr.length;
  // 根据解码结果字符串的长度创建一个等长的整形数字数组
  // 但在创建时 所有元素初始值都为 0
  const u8arr = new Uint8Array(n);
  // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
  while (n--) {
    // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
    u8arr[n] = bstr.charCodeAt(n);
  }
  // 利用构造函数创建File文件对象
  // new File(bits, name, options)
  const file = new File([u8arr], `${fileName}.${suffix}`, {
    type: type,
  });

  return file;
}


/**
 * 导出 Excel 文件
 * @param excelData Excel 数据（字符串或 Blob 数据）
 * @param contentType 内容类型
 * @param fileName 文件名
 */
export const downloadExcel = (excelData: string, contentType: string, fileName: string) => {
  const blob = new Blob([excelData], { type: contentType });
  const msSaveBlob = (window.navigator as any).msSaveBlob;
  if (typeof msSaveBlob !== 'undefined') {
    /*
      * IE workaround for "HTML7007: One or more blob URLs were revoked by closing
      * the blob for which they were created. These URLs will no longer resolve as
      * the data backing the URL has been freed."
      */
    msSaveBlob(blob, fileName);
  } else {
    const URL = window.URL || window.webkitURL;
    //console.log(URL, 'URLURLURLURL');
    const objectUrl = URL.createObjectURL(blob);
    //console.log(objectUrl, 'objectUrlobjectUrlobjectUrl');
    if (fileName) {
      const a = document.createElement('a');
      // safari doesn't support this yet
      if (typeof a.download === 'undefined') {
        // @ts-ignore
        window.location = objectUrl;
      } else {
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } else {
      // @ts-ignore
      window.location = objectUrl;
    }
  }
};

/**
 * 处理文本溢出显示省略号
 * 遍历指定 class 的元素，当内容高度超过 scrollHeight 时截断并添加 "..."
 * @param className 目标元素的类名，默认为 "text-overflow-five"
 */
export function textOverflowMore(className = "text-overflow-five") {
  let elList: any = document.getElementsByClassName(className);
  // 遍历所有具有特定样式名的元素
  for (let i in elList) {
    let el = elList[i];
    let text = el.innerHTML;
    // 遍历元素的innerHTML内容，当元素的offsetHeight小于scrollHeight（超出元素的高度溢出换行）时，
    // 设置溢出隐藏（overflow = "hidden"）
    if (!text || !text.length) return;
    for (let i = 0; i <= text.length; i++) {
      el.innerHTML = text.substr(0, i);
      if (el.offsetHeight < el.scrollHeight) {
        el.style.overflow = "hidden";
        // 截取当前字符串0-倒数第三的区间位置的字符并加上"..."，然后赋值给元素的innerHTML
        el.innerHTML = text.substr(0, i - 3) + "...";
        break;
      }
    }
  }
}

/**
 * 获取指定名称的 Cookie 值
 * @param name Cookie 名称
 * @param cookie Cookie 字符串
 * @returns Cookie 值
 */
export function getCookie(name: string, cookie: string) {
  const value = "; " + cookie;
  const parts:any = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
}

/**
 * 数字转货币格式（千分位分隔）
 * @param value 需要格式化的数字
 * @returns 格式化后的字符串
 */
export function numberToCurrencyNo(value: number) {
  if (!value) return 0
  // 获取整数部分
  const intPart = Math.trunc(value)
  // 整数部分处理，增加,
  const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  // 预定义小数部分
  let floatPart = ''
  // 将数值截取为小数部分和整数部分
  const valueArray = value.toString().split('.')
  if (valueArray.length === 2) { // 有小数部分
    floatPart = valueArray[1].toString() // 取得小数部分
    return intPartFormat + '.' + floatPart
  }
  return intPartFormat + floatPart
}

/**
 * 复制文本到剪贴板
 * @param text 需要复制的文本
 */
/** 复制文本到剪贴板并提示成功（使用 App 上下文内的 message，与主题一致） */
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(function() {
    getAntdMessage().success('复制成功')
  }).catch(function(err) {
    console.error('复制失败: ', err);
  });
}

/**
 * 将国家列表数组转换为对象，以 country.code 为 key
 * @param countries 国家列表数组
 * @param valueName 需要作为值的字段名
 * @returns 转换后的对象
 */
export function convertCountriesToObject(countries: any[], valueName: string) {
  return countries.reduce((obj: any, country: any) => {
    obj[country.code] = country[valueName];
    return obj;
  }, {});
}

/**
 * 获取当前选中的国家代码
 * 优先级：localStorage('curCountry') > localStorage('countryList')[0] > localStorage('allCountryList')[0] > 'CN'
 * @returns 国家代码 (e.g. 'CN')
 */
export function getCurCountryCode() {
  const cur = localStorage.getItem('curCountry');
  if (cur) return cur;
  try {
    const list = JSON.parse(localStorage.getItem('countryList') ?? '[]');
    if (Array.isArray(list) && list.length) return list[0]?.code ?? 'CN';
  } catch {}
  try {
    const all = JSON.parse(localStorage.getItem('allCountryList') ?? '[]');
    if (Array.isArray(all) && all.length) return all[0]?.code ?? 'CN';
  } catch {}
  return 'CN';
}

/**
 * 根据国家代码获取货币单位
 * 从 localStorage('allCountryList') 中查找
 * @param code 国家代码
 * @returns 货币单位字符串，未找到返回空字符串
 */
export function getCurrencyByCountryCode(code: string) {
  try {
    const all = JSON.parse(localStorage.getItem('allCountryList') ?? '[]');
    const found = Array.isArray(all) ? all.find((it: any) => it?.code === code) : undefined;
    return found?.currency ?? '';
  } catch {
    return '';
  }
}
