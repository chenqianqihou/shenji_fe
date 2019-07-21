import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import {Icon,Button,Modal,Table} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ShowFields from '../../../components/ShowFieds'
import styles from './index.less';
import {provincialName } from '../../../utils/url';


@connect(({projectDetail}) => ({
  projectDetail,
}))
export default class AuditTeam extends Component {

  state = {
    modalVisible:false
  }
  componentDidMount(){
  }

  handleUpdateProjectAuditGroup = (key)=>{
    dispatch({
      type: 'projectDetail/updateProjectStatus',
      payload:{
        operate:key
      }
    })
  }

  renderTale = (data)=>{
    const {projectDetail:{role}} = this.props
    const columns = [
      { title: '姓名', dataIndex: 'name' },
      { title: '人员ID', dataIndex: 'pid' },
      { title: '性别', dataIndex: 'sex'},
      { title: '职称', dataIndex: 'techtitle'},
      { title: '能力等级', dataIndex: 'level'},
      { title: '机构类型', dataIndex: 'type'},
      { title: '所属省市区', dataIndex: 'location'},
      { title: '项目角色', dataIndex: 'role',render:(text)=>role[text]},
      { title: '操作',
        dataIndex: 'manage',
        fixed: 'right',
        width: 180,
        render: (text, record, index) => <span>
          <a onClick={() => this.handleItemDel(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleItemUpdate(record)}>更改角色</a>
          {
              record.lock == 2
              ? <span>
                <Divider type="vertical" />
                <a onClick={() => this.handleItemDetail(record)}>解锁</a>
              </span>
              : null
          }
        </span> 
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={data}
      >
      </Table>
    )

  }

  renderAuditGroup = ()=>{
    const {projectDetail:{projectData:{auditgroup={}},auditStatus,auditOperate}} = this.props
    
      return(
        <div>
          {
            auditgroup.list && auditgroup.list.map((TableItem,index)=>(
              <div className={styles['tableItem']} key={index}>
                <div className={styles['title']}>
                  审计组{index}
                  <span className="msg">审计组状态：{auditStatus[TableItem.status] || '--'}</span>
                </div>
                <div className="action-buttons">
                  <Button type="primary">新增成员</Button>
                  {
                    auditOperate[TableItem.operate]
                    ? <Button onClick={()=>this.handleUpdateProjectAuditGroup(TableItem.operate)}>{auditOperate[TableItem.operate]}</Button>
                    : null
                  }
                  {this.renderTale(TableItem.group)}
                </div>
              </div>
            ))
          }
        </div>
      )
  }

  render() {
    const {
      projectDetail:{projectData:{head={},basic={}},projectStatus}} = this.props
    return (
      <div className={styles["audit-team"]}>
        {this.renderAuditGroup()}
      </div>
    );
  }
}
