import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal , message} from 'antd'
import { getDetailDate ,updateProjectStatus,updateProjectAuditInfo,updateProjectAuditGroup} from './service';
import { getUrlParams } from '../../../utils/url';

const Model = {
  namespace: 'projectDetail',

  state: {
    projectStatus:{
      1:"确认计划",
      2:"项目启动",
      3:"开始审理",
      4:"结束审理"
    },
    auditStatus:{
      1:'应进点',
      2:'该进点而未进点',
      3:'已进点',
      4:'该结束未结束',
      5:'实施结束',
      6:'待报告',
      7:'报告中',
      8:'报告结束' 
    }, 
    // 审计组长
    auditOperate:{
      1:'进点',
      2:'实施结束',
      3:'开始报告',
      4:'报告结束'
    },
    role:{
      1:'审计组长',
      2:'主审',
      3:'审计组员'
    },
    projectData:{},
  },
 
  effects: {
    *getDetailDate({ payload }, { call, put }) {
      const query = getUrlParams()
      const { id } = query
      if(id){
        const projectData = yield call(getDetailDate, {id:id})
        yield put({
          type: 'setState',
          payload: {
            projectData:projectData.data || {},
          },
        });
      } else {
        
      }
      
    },

    *updateProjectStatus({ payload }, { call, put }) {
      const query = getUrlParams()
      const { id } = query
      response = yield call(updateProjectStatus, Object.assign(payload,{id:id}))
      if(response.error.returnCode === 0){
        Modal.success({
          title:'提示',
          content:'操作成功',
          onOk:()=>{
            window.location.reload()
          }
        })
      } else {
        Modal.error({
          title:'操作失败',
          content:response.error.returnUserMessage,
        })
      } 
    },

    *updateProjectAuditInfo({ payload }, { call, put }) {
      const query = getUrlParams()
      const { id } = query
      response = yield call(updateProjectAuditInfo, Object.assign(payload,{id:id}))
      if(response.error.returnCode === 0){
        message.success('编辑成功')
        window.location.reload()
      } else {
        Modal.error({
          title:'操作失败',
          content:response.error.returnUserMessage,
        })
      } 
    },
    *updateProjectAuditGroup({ payload }, { call, put }) {
      const query = getUrlParams()
      const { id } = query
      response = yield call(updateProjectAuditGroup, Object.assign(payload,{id:id}))
      if(response.error.returnCode === 0){
        message.success('操作成功')
        window.location.reload()
      } else {
        Modal.error({
          title:'操作失败',
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
