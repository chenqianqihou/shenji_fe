import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ShowFields from '../../../../components/ShowFieds'
import styles from './index.less';
import {provincialName } from '../../../../utils/url';

@connect(({mechanismShow}) => ({
  mechanismShow,
}))
export default class MechanismShow extends Component {

  componentDidMount(){
    const { dispatch } = this.props;

    dispatch({
      type: 'mechanismShow/getOptions',
    })
  }

  convertData = ()=>{
    const {mechanismShow:{formData={},options}} = this.props
    const data = [
      {
        title:'公司背景',
        rows:[
          {
            title:'机构名称',
            value:formData.name || ''
          },
          {
            title:'法定代表人',
            value:formData.deputy || ''
          },
          {
            title:'注册时间',
            value:formData.regtime?moment(formData.regtime * 1000).format('YYYY年MM月DD日'):''
          },
          {
            title:'注册地址',
            value:formData.regnum?provincialName(formData.regnum) +'，'+formData.regaddress : ''
          },
          {
            title:'资质类别',
            value:formData.category || ''
          },
          {
            title:'资质等级',
            value:formData.level || ''
          },
          {
            title:'注册资本',
            value:formData.capital || ''
          },
        ]
      },
      {
        title:'基本信息',
        rows:[
          {
            title:'开始从业日期',
            value:formData.workbegin?moment(formData.workbegin * 1000).format('YYYY年MM月DD日'):''
          },
          {
            title:'造价工程师',
            value:formData.costeng || ''
          },
          {
            title:'造价员',
            value:formData.coster || ''
          },
          {
            title:'注册会计师',
            value:formData.accountant || ''
          },
          {
            title:'在册专业技术人员总数',
            value:formData.costeng+formData.coster+formData.accountant || ''
          },
          {
            title:'高级职称',
            value:formData.highlevel || ''
          },
          {
            title:'中级职称',
            value:formData.midlevel || ''
          },
          {
            title:'有职称人员总数',
            value:formData.highlevel+formData.midlevel || ''
          },
          {
            title:'聘请退休人员专业',
            value:formData.retiree || ''
          },
          {
            title:'兼职专业人员',
            value:formData.parttirmers || ''
          },
        ]
      },
      {
        title:'联系方式',
        rows:[
          {
            title:'联系人',
            value:formData.contactor || ''
          },
          {
            title:'联系人电话',
            value:formData.contactphone || ''
          },
          {
            title:'联系电话',
            value:formData.contactnumber || ''
          },
          {
            title:'办公地址',
            value:formData.officenum?provincialName(formData.officenum) +'，'+formData.officeaddress : ''
          },    
        ]
      },
      {
        title:'审核情况',
        rows:[
          {
            title:'资质审核',
            value:options.qualiaudit[formData.qualiaudit] || ''
          }, 
        ]
      }
    ]
    return data
  }

  render() {
    const data = this.convertData()
    return (
      <div className={styles["role_manager_show"]}>
        <PageHeaderWrapper />
        <div className={styles["role_manager-contain"]}>
          <ShowFields data={data}/>
        </div>
      </div>
    );
  }
}
