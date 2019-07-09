import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { AccountLogin } from './service';
import { getPageQuery, setToken } from '../../../utils/utils';

export interface StateType {
  status?: true | false;
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  token?: string;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: true,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      console.log(response);
      if (response.error.returnCode === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }else{
          window.location.href = '/';
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setToken(payload.data.token);
      return {
        ...state,
        status: payload.error.returnCode === 0,
        type: payload.type,
      };
    },
  },
};

export default Model;
