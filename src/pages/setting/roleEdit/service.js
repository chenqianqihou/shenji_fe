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
  return request('/api/organization/list')
}

export async function getFormData(params){
  return request('/api/user/info?account='+params.account)
}

