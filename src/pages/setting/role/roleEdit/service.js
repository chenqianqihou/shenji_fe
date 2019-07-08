import request from '@/utils/request';

export async function getUserRoleOptions(){
  return request(`/api/user/selectconfig`)
}

export async function getProvincialOptions(){
  return request('/api/districts/list')
}

export async function getFormAdd(params){
  return request('/api/user/add',{
    method: 'POST',
    data: params
  })
}

export async function getOrganization(params){
  return request('/api/organization/search?start=0&length=-1&type='+params.type)
}

export async function getFormData(params){
  return request('/api/user/info',{
    method: 'POST',
    data: params
  })
}

