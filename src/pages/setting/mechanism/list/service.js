import request from '@/utils/request';

// 获取列表 & 查询列表
export async function getOrgList(params) {
    // ?key=国家&type=1&start=0&length=10'
    return request('/api/organization/search', { params });
}

// 删除（批量）
export async function delOrg(params) {
    return request('/api/organization/delete', {
        method: 'POST',
        data: params,
    });
}

// 批量导入 ？？？
export async function addMulti() {
    return request('/api/organization/multiadd');
}
