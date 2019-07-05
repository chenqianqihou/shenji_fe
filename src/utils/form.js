//表单校验的公共方法

//是否是正确的身份证号
export const cardValid = function(value) {
  var ex = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(19|2[0-9])((\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(\d{2}(0[13578]|1[02])31)|(\d{2}02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
  var pattern = new RegExp(ex);
  if (!pattern.test(value)) {
    return false;
  }
  var params = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var checks = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  var id = value;
  var sum = 0;
  for (var i = 0; i < 17; i++) {
    var tmp = id.charAt(i);
    sum += params[i] * tmp;
  }
  sum %= 11;
  var check;
  if (id.charAt(17) == 'x' || id.charAt(17) == 'X') {
    check = 10;
  } else {
    check = id.charAt(17);
  }
  return check == checks[sum];
};

export const  UserId2Birthday = (UUserCard)=>{ 
  //获取出生日期 
  return UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14); 
} 

export const UserId2Age = (UUserCard)=>{
  //获取年龄 
  var myDate = new Date(); 
  var month = myDate.getMonth() + 1; 
  var day = myDate.getDate(); 
  var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1; 
  if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) { 
    age++; 
  } 
  return age
}

export const UserId2Sex = (UUserCard)=>{
//获取性别 
  if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) { 
    return 'man'
  } else { 
    return 'woman'
  } 
}
