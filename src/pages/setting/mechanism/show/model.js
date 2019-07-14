import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { getOption ,getFormData} from './service';
import { getUrlParams } from '../../../../utils/url';

const Model = {
  namespace: 'mechanismShow',

  state: {
    options: {
      otype:{
        1:'中介结构',
        2:'内审机关',
        3:'机关'
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
      // const response = yield call(getOption, payload)
      if(oid){
        const formData = yield call(getFormData, {oid:oid})
        yield put({
          type: 'setState',
          payload: {
            formData:formData.data || {},
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
