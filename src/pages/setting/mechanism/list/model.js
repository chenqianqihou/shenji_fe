import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getOrgList, delOrg } from './service';

const Model = {
    namespace: 'orgList',
    state: {},
    effects: {
        // 获取列表
        *getOrgLists({ payload }, { call, put }) {
            const response = yield call(getOrgList, payload);
            yield put({
                type: 'setTableData',
                payload: response.data || [],
            });
        },

        // 删除
        *removeOrgs({ payload, callback }, { call, put }) {
            const response = yield call(delOrg, payload);
            if (response.error.returnCode === 0) {
                message.success('删除成功');
            }
            if (callback) {
                callback();
            }
        },
    },

    reducers: {
        setTableData(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};

export default Model;
