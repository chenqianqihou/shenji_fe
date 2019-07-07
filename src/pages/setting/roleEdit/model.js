import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import {Modal} from 'antd'
import { getUserRoleOptions,getProvincialOptions,getFormAdd,getOrganization ,getFormData} from './service';
import { getUrlParams } from '../../../utils/url';

const Model = {
  namespace: 'roleEdit',

  state: {
    options: {},
    provincial:{},
    formData:{},
    organization:[]
  },

  effects: {
    *getOptions({ payload }, { call, put }) {
      const query = getUrlParams()
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
            organization:organization.data && organization.data.list || []
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
    *getOrganization({ payload }, { call, put }){
      const organization = yield call(getOrganization,payload)
      yield put({
        type: 'setState',
        payload: {
          organization:organization.data && organization.data.list || []
        },
      });
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

    *submitForm({ payload }, { call, put }) {
      const response = yield call(getFormAdd, payload)
      if(response.error.returnCode === 0){
        Modal.success({
          title:'提示',
          content:'保存成功',
          onOk:()=>{
            window.history.back()
          }
        })
      } else {
        Modal.error({
          title:'保存失败',
          content:response.error.returnUserMessage,
        })
      }
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
