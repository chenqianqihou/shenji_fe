import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {  Row, Col } from 'antd';
import { cardValid, UserId2Birthday,UserId2Age,UserId2Sex } from '../../utils/form';
import moment from "moment"
import styles from './index.less';




@connect(({roleShow}) => ({
  roleShow,
}))
export default class RoleShowFileds extends Component {

  componentDidMount(){
    const { dispatch } = this.props;

    dispatch({
      type: 'roleShow/getOptions',
    });
  }


  convertData = ()=>{
    console.log('this.propsthis.props',this.props)
    const {roleShow:{formData={},options,provincial,organization}} = this.props
    const data = [
      {
        title:'个人信息',
        rows:[
          {
            title:'姓名',
            value:formData.name || ''
          },
          {
            title:'身份证号',
            value:formData.cardid || ''
          },
          {
            title:'性别',
            value: UserId2Sex(formData.cardid) === 1?'男':'女'
          },
          {
            title:'出生年月',
            value:(()=>{
              console.log('UserId2Birthday(formData.cardid)',UserId2Birthday(formData.cardid))
              return UserId2Birthday(formData.cardid)?moment(UserId2Birthday(formData.cardid)).format('YYYY年MM月DD日') : ''
            })()
          },
          {
            title:'年龄',
            value:UserId2Age(formData.cardid) || ''
          },
          {
            title:'手机号',
            value:formData.phone || ''
          },
          {
            title:'邮箱',
            value:formData.email || ''
          },
          {
            title:'联系地址',
            value:formData.address || ''
          },
        ]
      },
      {
        title:'教育信息',
        rows:[
          {
            title:'学历',
            value:options.education?options.education[formData.education] : ''
          },
          {
            title:'毕业学校',
            value:formData.school || ''
          },
          {
            title:'所学专业',
            value:formData.major || ''
          },
          {
            title:'政治面貌',
            value:options.political?options.political[formData.political] : ''
          },
        ]
      },
      {
        title:'职能信息',
        rows:[
          {
            title:'所属省市区',
            value:(()=>{
              const location = formData.location?formData.location.split(','):[]
              let value = ''
              if(location[0]) value += provincial[100000][location[0]] ? provincial[100000][location[0]]+'，' : ''
              if(location[1]) value += provincial[location[0]][location[1]] ? provincial[location[0]][location[1]]+'，' : ''
              if(location[2]) value += provincial[location[1]][location[2]] ? provincial[location[1]][location[2]]+'，' : ''

              return value
            })()
          },
          {
            title:'能力等级',
            value:options.level?options.level[formData.level] : ''
          },
          {
            title:'所属类型',
            value:(()=>{
              const roleType = {
                1:"审计机关",
                2:"内审机构",
                3:"中介机构"
              }
              return roleType[formData.type] || ''
            })()
          },
          {
            title:'所属机构',
            value:(()=>{
              let value = ''
              organization.forEach(item=>{
                if(item.id == formData.organization){
                  value = item.name
                }
              })
              return value
            })()
          }
        ].concat(this.renderConvertDeficitData())
      },
      {
        title:'其他信息',
        rows:[
          {
            title:'备注',
            width:'100%',
            value:formData.comment || ''
          },
          {
            title:'角色配置',
            value:(()=>{
              let value = ''
              formData.role && formData.role.forEach(item=>{
                value += options.role?options.role[item]+'，' : ''
              }) 
              return value          
            })()
          }
        ]
      }
    ]
    return data
  }

  renderConvertDeficitData(){
    const {roleShow:{formData,options,provincial}} = this.props
    switch(parseInt(formData.type)){
      //审计机关
      case 3:
        return [
          {
            title:'所属部门',
            value:formData.department || ''
          },
          {
            title:'现任职务',
            value:options.position?options.position[formData.position] : ''
          },
          {
            title:'岗位性质',
            value:options.nature?options.nature[formData.nature] : ''
          },
          {
            title:'专业技术职称',
            value:(()=>{
              const techtitle = formData.techtitle
              let value = ''
              techtitle.forEach(item=>{
                value += options.techtitle[item]+'，' || ''
              })
              return value
            })()
          },
          {
            title:'审计特长',
            value:(()=>{
              const expertise = formData.expertise
              let value = ''
              expertise.forEach(item=>{
                value += options.expertise[item]+'，' || ''
              })
              return value
            })()
          },
          {
            title:'业务培训情况',
            width:'100%',
            value:(()=>{
              const train = formData.train
              let value = ''
              train.forEach((item,index)=>{
                value += index+1+'. '+item+'。' || ''
              })
              return value
            })()
          },
          {
            title:'参加工作年月',
            value:formData.workbegin?moment(formData.workbegin).format('YYYY年MM月DD日'):''
          },
          {
            title:'参加审计年月',
            value:formData.auditbegin?moment(formData.auditbegin).format('YYYY年MM月DD日'):''
          },
        ]
      //内审机构
      //中介机构
      case 2:
      case 1:
        return [
          {
            title:'所属机构',
            value:''
          },
          {
            title:'现任职务',
            value:formData.position || ''
          },
          {
            title:'开始从业日期',
            value:formData.workbegin?moment(formData.workbegin).format('YYYY年MM月DD日'):''
          },
          {
            title:'专业特长',
            width:'100%',
            value:formData.specialties || ''
          },
          {
            title:'专业技术资质和获取年限',
            width:'100%',
            value:(()=>{
              const qualification = formData.qualification
              let value = ''
              qualification.forEach((item,index)=>{
                value += index+1+'. '+item.info+'，获取年限：'+moment(item.time).format('YYYY年MM月DD日')+'。' || ''
              })
              return value
            })()
          },
          {
            title:'近三年主要业绩',
            width:'100%',
            value:formData.achievements || ''
          },
        ]
      default:
        return []
    }
  }

  render() {
    const data = this.convertData()
    return (
      <div className={styles["fields_main"]}>
        {
          data.map(fieldItem=>(
            <div className={styles["fields_modal"]} key={fieldItem.title}>
              <div className={styles['title']}>{fieldItem.title}</div>
                <div className={styles['rows_contain']}>
                {
                  fieldItem.rows && fieldItem.rows.map((item,index)=>{
                    return(
                    <div style={item.width?{width:item.width}:{}}className={styles['item']} key={`item${index}`} dangerouslySetInnerHTML={{__html:`${item.title}：${item.value}`}}>
                    </div>
                  )})
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
