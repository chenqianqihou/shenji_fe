import provincialJSON from './provincial.json'

export const getUrlParams = ()=>{
  const url = window.location.href
  var params = {};
  var urls = url.split("?");                 
  var arr = urls[1]?urls[1].split("&") : [];             
  for (var i = 0, l = arr.length; i < l; i++) {
    var a = arr[i].split("=");                
    params[a[0]] = a[1];                      
  }                                          
  return params;
}

//省级的下拉框选项
export const renderProvincialOption = ()=>{
  return provincialJSON[100000]
}
//市级的下拉框选项
export const renderCityOption = (code)=>{
  return provincialJSON[code]
}

//区县的下拉选择框
export const renderCountyOption = (code)=>{
  return provincialJSON[code]
}

//对应的省市区，code逗号分隔
export const provincialName = (code)=>{
  if(!code) return ''
  const cityCode = code.split(',')
  const cityName = []
  try{
    cityName[0] = cityCode[0]?provincialJSON[100000][cityCode[0]]:''
    cityName[1] = cityCode[1]?provincialJSON[100000][cityCode[0]][cityCode[1]]:''
    cityName[2] = cityCode[2]?provincialJSON[100000][cityCode[1]][cityCode[2]]:''
  }catch(){
    cityName = ['城市编码错误']
  }
  return cityName.join('，')
}

