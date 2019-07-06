import request from '@/utils/request';

export async function userSelect(): Promise<any> {
  return request('/api/user/selectconfig');
}