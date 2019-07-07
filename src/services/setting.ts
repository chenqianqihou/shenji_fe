import request from '@/utils/request';

export async function userSelect(): Promise<any> {
  return request('/api/user/selectconfig');
}

interface getOrgUsersParam {
    organid: string,
    start: number,
    length: number
}

export async function getOrgUsers( params: getOrgUsersParam): Promise<any> {
    return request('/api/organization/users', {
        params
    })
}

export async function getOrgList(): Promise<any> {
    return request('/api/organization/list');
}

interface resetPwdParam {
    pid: string
}
export async function resetPwd( params: resetPwdParam): Promise<any> {
    return request('/api/user/pwdreset', {
        method: 'POST',
        data: params
    })
}

interface deleteUsers{
    pid: object
}
export async function deleteUsers( params: deleteUsers): Promise<any> {
    return request('/api/user/delete',{
        method: 'POST',
        data: params
    })
}

interface queryUserParam {
    organization: number,
    query: string,
    length: number,
    page: number
}
export async function queryUser(params: queryUserParam): Promise<any> {
    return request('/api/user/list',{
        method: 'POST',
        data: params
    }) 
}