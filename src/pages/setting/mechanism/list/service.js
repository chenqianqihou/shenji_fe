import request from '@/utils/request';

// 获取列表 & 查询列表
export async function getOrgList(params) {
    // ?key=国家&type=1&start=0&length=10'
    return request('/api/organization/search', { params });
}

/**
 * 批量删除
 * @param {*} params {oid: []}
 */
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


/**
 * 快速新增机构，用于树节点操作
 * @param {object} params {"pid":"1016","name":"asdfsadf"}
 */
export async function quickAddOrg(params) {
    return request('/api/organization/addbyname', {
        method: 'POST',
        data: params,
    });
}

/**
 * 快速修改机构，
 * @param {object} params {id: 111, name: 'qwqwe'}
 */
export async function quickEditOrg(params) {
    return request('/api/organization/update', {
        method: 'POST',
        data: params,
    });
}
