import request from '@/utils/request';

export async function getOptions(){
  return request(`/api/user/selectconfig`)
}

export async function getFormData(params){
  return request('/api/organization/info',{
    method: 'POST',
    data: params
  })
}
