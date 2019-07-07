import request from '@/utils/request';

export async function getUserRoleOptions(){
  return request(`/api/user/selectconfig`)
}

export async function getProvincialOptions(){
  return request('/api/districts/list')
}

export async function getFormData(params){
  return request('/api/user/info',{
    method: 'POST',
    data: params
  })
}