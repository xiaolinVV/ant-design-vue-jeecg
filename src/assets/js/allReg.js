let reg = {
  phone: /^1[3456789]\d{9}$/,//手机号
  positiveInteger:/^[+]{0,1}(\d+)$/,//正整数
// /^[1-9](\d+)?(\.\d{1,2})?$|(^\d\.\d{1,2}$)/  大于0并最多两位小数点的正数(金额)
  money:  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,//金额
  Id: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//身份证校验
  name: /^[\u4e00-\u9fa5]{2,4}$////真实姓名
  //证券代码
}
//手机号校验
function checkPhone(strMobile) {
  let re = new RegExp(reg.phone)
  return re.test(strMobile)
}
//正数校验
function isInteger(str) {
  let regu = /^[-]{0,1}[0-9]{1,}$/
  return regu.test(str)
}
//正整数校验
function isDecimal(str) {
  if (isInteger(str)) {
    if (reg.positiveInteger.test(str)) {
      if (RegExp.$1 == 0 && RegExp.$2 == 0) {
        return false
      }
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
//金额校验
function isMoney(s) {
  let re = new RegExp(reg.money)
  if(re.test(s)){
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return  {
    validateStatus: 'error',
    errorMsg: '这不是金额！',
  };
}
//身份证校验
function isId(str){
  let re = new RegExp(reg.Id)
  return re.test(str)
}
//真实姓名校验
function isName(str){
  let re = new RegExp(reg.name)
  return re.test(str)
}
export {
  checkPhone,
  isInteger,
  isDecimal,
  isMoney,
  isId,
  isName
}

