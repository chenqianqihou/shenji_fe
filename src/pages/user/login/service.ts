import request from '@/utils/request';
import { FromDataType } from './index';

export async function AccountLogin(params: FromDataType){
  return request('/api/user/login',{
    method: 'POST',
    data: params
  })
}