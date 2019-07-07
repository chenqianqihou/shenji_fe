import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { getUserRoleOptions,getProvincialOptions } from './service';
import { getPageQuery, setToken } from '../../../utils/utils';

const Model = {
  namespace: 'roleEdit',

  state: {
    options: {},
    provincial:{}
  },

  effects: {
    *getOptions({ payload }, { call, put }) {
      const response = yield call(getUserRoleOptions, payload)
      const provincialResponse = yield call(getProvincialOptions,payload)
      yield put({
        type: 'setState',
        payload: {
          options:response.data || {},
          provincial:provincialResponse.data || {}
        },
      });
    }
  },

  reducers: {
    setState(state, {payload}) {
      return {
        ...state,
        ...payload
      };
    },
  },
};

export default Model;
