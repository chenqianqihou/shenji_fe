import request from '@/utils/request';

export async function getUserRoleOptions(){
  return request(`/api/user/selectconfig`)
}


export async function getFormData(params){
  return request('/api/organization/info',{
    method: 'POST',
    data: params
  })
}

export async function getFormAdd(params){
  return request('/api/organization/add',{
    method: 'POST',
    data: params
  })
}


export async function getFormUpload(params){
  return request('/api/organization/update',{
    method: 'POST',
    data: params
  })
}

