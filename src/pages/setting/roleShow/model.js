import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { getUserRoleOptions ,getProvincialOptions,getFormData} from './service';
import { getUrlParams } from '../../../utils/url';

const query = getUrlParams()

const Model = {
  namespace: 'roleShow',

  state: {
    options: {},
    formData:{},
    provincial:{}
  },
 
  effects: {
    *getOptions({ payload }, { call, put }) {
      const { account } = query
      const response = yield call(getUserRoleOptions, payload)
      const provincialResponse = yield call(getProvincialOptions,payload)
      if(account){
        const formData = yield call(getFormData, {account:account})
        yield put({
          type: 'setState',
          payload: {
            formData:formData.data || {},
            options:response.data || {},
            provincial:provincialResponse.data || {}
          },
        });
      } else {
        yield put({
          type: 'setState',
          payload: {
            options:response.data || {},
            provincial:provincialResponse.data || {}
          },
        });
      }
      
    },

    *getFormData({ payload }, { call, put }) {
      const response = yield call(getFormData, payload)

      yield put({
        type: 'setState',
        payload: {
          formData:response.data || {}
        },
      });
    },
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
