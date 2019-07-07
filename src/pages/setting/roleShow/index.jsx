import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {  Row, Col } from 'antd';

// eslint-disable-next-line react/prefer-stateless-function
@connect(({roleShow}) => ({
  roleShow,
}))
export default class RoleShow extends Component {

  convertData = ()=>{
    const data = [
      {
        title:'个人信息',
        rows:[
          {
            title:'姓名',
            value:''
          },
          {
            title:'身份证号',
            value:''
          },
          {
            title:'性别',
            value:''
          },
          {
            title:'出生年月',
            value:''
          },
          {
            title:'年龄',
            value:''
          },
          {
            title:'手机号',
            value:''
          },
          {
            title:'邮箱',
            value:''
          },
          {
            title:'联系地址',
            value:''
          },
        ]
      },
      {
        title:'教育信息',
        rows:[
          {
            title:'学历',
            value:''
          },
          {
            title:'毕业学校',
            value:''
          },
          {
            title:'所学专业',
            value:''
          },
          {
            title:'政治面貌',
            value:''
          },
          {
            title:'所属省市区',
            value:''
          },
        ]
      },
      {
        title:'职能信息',
        rows:this.renderConvertDeficitData()
      },
      {
        title:'其他信息',
        rows:[
          {
            title:'备注',
            value:''
          },
          {
            title:'角色配置',
            value:''
          }
        ]
      }
    ]
  }

  renderConvertDeficitData(){
    const roleType = 1
    switch(parseInt(roleType)){
      //审计机关
      case 1:
        return [
          {
            title:'所属部门',
            value:''
          },
          {
            title:'现任职务',
            value:''
          },
          {
            title:'岗位性质',
            value:''
          },
          {
            title:'专业技术职称',
            value:''
          },
          {
            title:'审计特长',
            value:''
          },
          {
            title:'业务培训情况',
            value:''
          },
          {
            title:'参加工作年月',
            value:''
          },
          {
            title:'参加审计年月',
            value:''
          },
        ]
      //内审机构
      //中介机构
      case 3:
      case 2:
        return [
          {
            title:'所属机构',
            value:''
          },
          {
            title:'现任职务',
            value:''
          },
          {
            title:'开始从业日期',
            value:''
          },
          {
            title:'专业特长',
            value:''
          },
          {
            title:'专业技术资质',
            value:''
          },
          {
            title:'获取专业技术资质日期',
            value:''
          },
          {
            title:'参加工作年月',
            value:''
          },
          {
            title:'参加审计年月',
            value:''
          },
        ]
      default:
        return null
    }
  }

  render() {
    return (
      <div className="role_manager_show">
        <PageHeaderWrapper />

        <div className="fields_main">
        <Row>
          <Col span={12}>col-12</Col>
          <Col span={12}>col-12</Col>
        </Row>
        </div>
      </div>
    );
  }
}
