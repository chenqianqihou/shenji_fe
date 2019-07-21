import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { getUserRoleOptions ,getProvincialOptions,getFormData,getOrganization} from './service';
import { getUrlParams } from '../../../../utils/url';

const query = getUrlParams()

const Model = {
  namespace: 'roleShow',

  state: {
    options: {},
    formData:{},
    provincial:{},
    organization:[]
  },
 
  effects: {
    *getOptions({ payload }, { call, put }) {
      const { account } = query
      const response = yield call(getUserRoleOptions, payload)
      const provincialResponse = yield call(getProvincialOptions,payload)
      if(account){
        const formData = yield call(getFormData, {account:account})
        const organization = yield call(getOrganization,{type:formData.data.type})
        yield put({
          type: 'setState',
          payload: {
            formData:formData.data || {},
            options:response.data || {},
            provincial:provincialResponse.data || {},
            organization:organization.data && organization.data.organlist || []
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
