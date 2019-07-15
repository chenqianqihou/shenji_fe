import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
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
        *removeOrgs({ payload }, { call, put }) {
            const response = yield call(delOrg, payload);
            yield put({
                type: 'removeOrg',
                payload: response.data || [],
            });
        },
    },

    reducers: {
        setTableData(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },

        removeOrgs({ payload }) {
            return {
                ...payload,
            };
        },
    },
};

export default Model;
