import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import {Icon,Tag,Tabs} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ShowFields from '../../../components/ShowFieds'
import BaseMsg from './baseMsg'
import AuditTeam from './auditTeam'
import styles from './index.less';
import {provincialName } from '../../../utils/url';

const { TabPane } = Tabs

@connect(({projectDetail}) => ({
  projectDetail,
}))
export default class MechanismShow extends Component {

  componentDidMount(){
    const { dispatch } = this.props;

    dispatch({
      type: 'projectDetail/getDetailDate',
    })
  }

  handleChangeProjectStatus = (key)=>{
    dispatch({
      type: 'projectDetail/updateProjectStatus',
      payload:{
        operate:key
      }
    })
  }

  renderButtons(){
    const {projectDetail:{projectData:{head={}},projectStatus}} = this.props
    let color = ''
    switch(parseInt(head.operate)){
      case 1:
        color = '#f50'
        break
      case 1:
        color = '#2db7f5'
        break
      case 1:
        color = '#87d068'
        break
      case 1:
        color = '#108ee9'
        break
      default:
        return null
    }
    return <Tag color={color} onClick={()=>this.handleChangeProjectStatus(projectStatus[head.operate])}>{projectStatus[head.operate]}</Tag>
  }

  convertData = ()=>{
    const {projectDetail:{projectData:{head={}},projectStatus}} = this.props
    const data = [
      {
        title:<div className={styles["project-title"]}>
            <Icon type="project" />
            <div className={styles["project-name"]}>{head.name}</div>
            {this.renderButtons()}
          </div>,
        rows:[
          {
            title:'项目阶段',
            width:'100%',
            value:head.projectnum || ''
          },
          {
            title:'项目编号',
            value:head.projectnum || ''
          },
          {
            title:'项目年度',
            value:head.projyear || ''
          },
          {
            title:'项目类型',
            value:head.projtype?head.projtype.join(',') : ''
          },
          {
            title:'项目层级',
            value:head.projlevel ||  ''
          },
          {
            title:'审计组长',
            value:head.leadernum ? head.leadernum+'人' :''
          },
          {
            title:'主审',
            value:head.masternum ? head.masternum+'人' :''
          },
          {
            title:'审计组员',
            value:head.auditornum ? head.auditornum+'人' :''
          },
          {
            title:'牵头业务部门',
            value:head.leadorgan || ''
          },
          {
            title:'项目单位',
            value:head.projorgan || ''
          },
          {
            title:'计划时长',
            value:head.plantime || ''
          },
        ]
      },
    ]
    return data
  }

  render() {
    const data = this.convertData()
    return (
      <div className={styles["project_detail_show"]}>
        <PageHeaderWrapper />
        <div className={styles["project_detail-contain"]}>
          <ShowFields data={data} hideButtom/>
        </div>
        <div className={styles["project_detail-tabs"]}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <BaseMsg/>
            </TabPane>
            <TabPane tab="审计组" key="2">
              <AuditTeam/>
            </TabPane>
            <TabPane tab="审理成员" key="3">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="审计评价" key="4">
              Content of Tab Pane 4
            </TabPane>
          </Tabs>
        </div>     
      </div>
    );
  }
}
