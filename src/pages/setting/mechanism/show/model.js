import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { getOption ,getFormData} from './service';
import { getUrlParams } from '../../../../utils/url';

const Model = {
  namespace: 'mechanismShow',

  state: {
    options: {},
    formData:{},
  },
 
  effects: {
    *getOptions({ payload }, { call, put }) {
      const query = getUrlParams()
      const { account } = query
      const response = yield call(getOption, payload)
      if(account){
        const formData = yield call(getFormData, {account:account})
        yield put({
          type: 'setState',
          payload: {
            formData:formData.data || {},
            options:response.data || {},
          },
        });
      } else {
        yield put({
          type: 'setState',
          payload: {
            options:response.data || {},
          },
        });
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
