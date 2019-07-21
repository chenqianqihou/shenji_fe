import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import {Modal} from 'antd'
import { getUserRoleOptions,getFormAdd ,
  getFormData,getFormUpload
} from './service';
import { getUrlParams } from '../../../utils/url';
 
const Model = {
  namespace: 'mechanismEdit',

  state: {
    options: {
      otype:{
        1:'中介机构',
        2:'内审机构',
      },
      qualiaudit:{
        1:'已审核',
        2:'未审核'
      }
    },
    formData:{},
  },

  effects: {
    *getOptions({ payload }, { call, put }) {
      const query = getUrlParams()
      const { oid } = query
      // const response = yield call(getUserRoleOptions, payload)
      if(oid){
        const formData = yield call(getFormData, {oid:oid})
        const data = formData.data || {}
        data.location = data.regnum?data.regnum+','+data.regaddress:''
        data.office = data.officenum?data.officenum+','+data.officeaddress:''
        yield put({
          type: 'setState',
          payload: {
            formData:data
            // options:response.data || {},
          },
        });
      } else {
        // yield put({
        //   type: 'setState',
        //   payload: {
        //     // options:response.data || {},
        //   },
        // });
      }

    },

    *submitForm({ payload }, { call, put }) {
      let response 
      const query = getUrlParams()
      const { oid } = query
      if(oid){
        payload.oid = oid
        response = yield call(getFormUpload, payload)
      }else{
        response = yield call(getFormAdd, payload)
      }

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
