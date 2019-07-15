import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { getUserRoleOptions ,getProvincialOptions,getFormData,getOrganization,submitPwd} from './service';
import { getUrlParams } from '../../utils/url';
import { Modal } from 'antd'

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
      const formData = yield call(getFormData)
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

    *submitPwd({ payload }, { call, put }) {
      const response = yield call(submitPwd, payload)

      if(response.error.returnCode === 0){
        Modal.success({
          title:'提示',
          content:'修改成功',
          onOk:()=>{
            window.history.back()
          }
        })
      } else {
        Modal.error({
          title:'修改失败',
          content:response.error.returnUserMessage,
        })
      }
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
