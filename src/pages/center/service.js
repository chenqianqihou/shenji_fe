import request from '@/utils/request';

export async function getUserRoleOptions(){
  return request(`/api/user/selectconfig`)
}

export async function getProvincialOptions(){
  return request('/api/districts/list')
}

export async function getFormData(params){
  return request('/api/user/my')
}

export async function getOrganization(params){
  return request('/api/project/selectconfig?start=0&length=-1&type='+params.type)
}

//修改密码
export async function submitPwd(params){
  return request('/api/user/pwd',{
    method: 'POST',
    data: params
  })
}
