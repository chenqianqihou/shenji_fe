import request from '@/utils/request';

export async function getDetailDate(params){
  return request(`/api/project/info?`,{
    method: 'POST',
    data: params
  })
}

//项目状态更新
export async function updateProjectStatus(params){
  return request('/api/project/updatestatus',{
    method: 'POST',
    data: params
  })
}

//变更审计信息接口
export async function updateProjectAuditInfo(params){
  return request('api/project/auditinfo',{
    method: 'POST',
    data: params
  })
}

//审计组长变更状态
export async function updateProjectAuditGroup(params){
  return request('api/auditgroup/updatestatus',{
    method: 'POST',
    data: params
  })
}

//更改角色
export async function updateProjectRole(params){
  return request('api/auditgroup/updaterole',{
    method: 'POST',
    data: params
  })
}

//删除人员
export async function updateProjectDelete(params){
  return request('api/auditgroup/delete',{
    method: 'POST',
    data: params
  })
}

//解锁人员
export async function updateProjectUnlock(params){
  return request('api/auditgroup/unlock',{
    method: 'POST',
    data: params
  })
}
