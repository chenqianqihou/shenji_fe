import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Form, Select,DatePicker ,InputNumber,Button} from 'antd';
import moment from 'moment'
import { renderProvincialOption, renderCityOption,renderCountyOption,provincialName } from '../../../../utils/url';
import styles from './index.less';

const TextArea = Input.TextArea
let roleTypeFlag = true
// eslint-disable-next-line react/prefer-stateless-function
@Form.create()
@connect(({mechanismEdit}) => ({
  mechanismEdit,
}))
export default class MechanismEditEdit extends Component {
  state= {
   
  }
  
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'mechanismEdit/getOptions',
    });
  }

  // componentWillReceiveProps(nextProps){
  //   if(nextProps.mechanismEdit.formData.type && roleTypeFlag){
  //     this.setState({
  //       organizationFilter:nextProps.mechanismEdit.organization,
  //       roleType:nextProps.mechanismEdit.formData.type || '',
  //     },()=>{
  //       roleTypeFlag = false
  //     })
  //   } else {
  //     this.setState({
  //       organizationFilter:nextProps.mechanismEdit.organization,
  //     })
  //   }
  // }

  handleChangeProvincial = (value,index,props)=>{
    const { form:{getFieldValue,setFieldsValue} } = this.props;
    const newProvincial = [].concat(getFieldValue(props))
    newProvincial[index] = value

    for(let i = index+1;i<3;i++){
      newProvincial[i] = ''
    }
    const obj = {}
    obj[props] = newProvincial
    setFieldsValue(obj)
  }


  handleSubmit = e => {
    const {dispatch} = this.props
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sendValues = Object.assign({},values)
        const location = formData.location.split(',')
        const office = formData.office.split(',')
        sendValues.regnum = location.splice(0,2)
        sendValues.regaddress = location[3]
        sendValues.officenum = office.splice(0,2)
        sendValues.officeaddress = office[3]

        dispatch({
          type: 'mechanismEdit/submitForm',
          payload:{
            ...sendValues
          }
        });
      }
    });
  };

  renderSelectOption(options={}){
    let dom = []
    Object.keys(options).forEach(key=>{
      dom.push(<Select.Option value={key}>{options[key]}</Select.Option>)
    })
    return dom
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const { form:{getFieldDecorator,getFieldValue},
      mechanismEdit:{options, formData} } = this.props;

    formData.location = formData.regnum?formData.regnum+','+formData.regaddress:''
    formData.office = formData.officenum?formData.officenum+','+formData.officeaddress:''

    return (
      <div className={styles["mechanism_contain"]}>
        <PageHeaderWrapper />
        <Form {...formItemLayout} className={styles["me_edit_form"]} onSubmit={this.handleSubmit}>

          <Form.Item label="机构类型" hasFeedback>
            {getFieldDecorator('otype', {
              initialValue:formData.otype,
              rules: [{ required: true, message: '请选择机构类型!' }],
            })(
              <Select placeholder="请选择机构类型">
                {this.renderSelectOption(options.otype)}
              </Select>
            )}
          </Form.Item>

          <div className={styles["title"]}>公司背景</div>

          <Form.Item label="机构名称" hasFeedback>
            {getFieldDecorator('name', {
              initialValue:formData.name,
              rules: [
                { required: true, message: '请输入机构名称!' },
              ],
            })(<Input placeholder="请输入机构名称" />)}
          </Form.Item>

          <Form.Item label="法定代表人" hasFeedback>
            {getFieldDecorator('deputy', {
              initialValue:formData.deputy,
              rules: [
                { required: true, message: '请输入法定代表人!' },
              ],
            })(<Input placeholder="请输入法定代表人" />)}
          </Form.Item>
          
          <Form.Item label="注册时间" hasFeedback>
            {getFieldDecorator('regtime', {
              rules:[
                { type: 'object',required: true, message: '请选择注册时间!' },
              ],
              initialValue:formData.regtime?moment(formData.regtime * 1000):null,
            })( <DatePicker allowClear={false}/>)}
          </Form.Item>

          <Form.Item label="注册地址" required>
            {getFieldDecorator('location', {
              initialValue:formData.location?formData.location.split(',') : ['','','',''],
              rules: [
                {
                  validator: (rule, value, callback) => {
                    
                    for(let i = 0 ;i<3;i++){
                      if (!value[i]) {
                        callback('请选择所属省市区!');
                        break;
                      }
                    }     
                    callback();
                  },
                },
              ],
            })(
              <div>
                <Select placeholder="请选择" value={getFieldValue('location')[0]} onChange={(value)=>this.handleChangeProvincial(value,0,'location')}>
                  {this.renderSelectOption(renderProvincialOption())}
                </Select>

                <Select placeholder="请选择" value={getFieldValue('location')[1]} onChange={(value)=>this.handleChangeProvincial(value,1,'location')}>
                  {this.renderSelectOption(renderCityOption(getFieldValue('location')[0]) || {})}
                </Select>

                <Select placeholder="请选择" value={getFieldValue('location')[2]} onChange={(value)=>this.handleChangeProvincial(value,2,'location')}>
                  {this.renderSelectOption(renderCountyOption(getFieldValue('location')[1])  || {})}
                </Select>

                <Input value={getFieldValue('location')[4] || ''} placeholder="请输入" />
              </div>
            )}
          </Form.Item>

          <Form.Item label="资质类别" hasFeedback>
            {getFieldDecorator('category', {
              initialValue:formData.category,
              rules: [
                { required: true, message: '请输入资质类别!' },
              ],
            })(<Input placeholder="请输入资质类别" />)}
          </Form.Item>

          <Form.Item label="注册资本" hasFeedback>
            {getFieldDecorator('capital', {
              initialValue:formData.capital,
              rules: [
                { required: true, message: '请输入注册资本!' },
              ],
            })(<Input placeholder="请输入注册资本" />)}
          </Form.Item>

          <div className={styles["title"]}>基本信息</div>

          <Form.Item label="开始从业日期" hasFeedback>
            {getFieldDecorator('workbegin', {
              rules:[
                { type: 'object',required: true, message: '请选择开始从业日期!' },
              ],
              initialValue:formData.workbegin?moment(formData.workbegin * 1000):null,
            })( <DatePicker allowClear={false}/>)}
          </Form.Item>

          <Form.Item label="造价工程师" hasFeedback>
            {getFieldDecorator('costeng', {
              initialValue: formData.costeng,
              rules:[
                { required: true, message: '请输入造价工程师!' },
              ],
            })(
              <InputNumber min={0} />
            )}
            <span className={styles["unit"]}>（人）</span>
          </Form.Item>

          <Form.Item label="造价师" hasFeedback>
            {getFieldDecorator('coster', {
              initialValue: formData.coster,
              rules:[
                { required: true, message: '请输入造价师!' },
              ],
            })(
              <InputNumber min={0} />
            )}
            <span className={styles["unit"]}>（人）</span>
          </Form.Item>

          <Form.Item label="注册会计员" hasFeedback>
            {getFieldDecorator('accountant', {
              initialValue: formData.accountant,
              rules:[
                { required: true, message: '请输入注册会计员!' },
              ],
            })(
              <InputNumber min={0} />
            )}
            <span className={styles["unit"]}>（人）</span>
          </Form.Item>

          <Form.Item label="在册专业技术人员总数">
            {getFieldDecorator('input-number', {
              initialValue: getFieldValue("costeng")+getFieldValue("coster")+getFieldValue("accountant") || 0,
            })(
              <InputNumber min={0} disabled/>
            )}
            <span className={styles["unit"]}>（人）</span>
          </Form.Item>

          <Form.Item label="高级职称" hasFeedback>
            {getFieldDecorator('highlevel', {
              initialValue: formData.highlevel,
              rules:[
                { required: true, message: '请输入高级职称!' },
              ],
            })(
              <InputNumber min={0} />
            )}
            <span className={styles["unit"]}>（人）</span>
          </Form.Item>

          <Form.Item label="中级职称" hasFeedback>
            {getFieldDecorator('midlevel', {
              initialValue: formData.midlevel,
              rules:[
                { required: true, message: '请输入中级职称!' },
              ],
            })(
              <InputNumber min={0} />
            )}
            <span className={styles["unit"]}>（人）</span>
          </Form.Item>

          <Form.Item label="有职称人员总数">
            {getFieldDecorator('input-number', {
              initialValue: getFieldValue('highlevel')+getFieldValue('midlevel') || 0,
            })(
              <InputNumber min={0} disabled/>
            )}
            <span className={styles["unit"]}>（人）</span>
          </Form.Item>
          
          <Form.Item label="聘请退休人员专业" hasFeedback>
            {getFieldDecorator('retiree', {
              initialValue:formData.retiree,
            })(<Input placeholder="请输入聘请退休人员专业" />)}
          </Form.Item>

          <Form.Item label="兼职专业人员" hasFeedback>
            {getFieldDecorator('parttirmers', {
              initialValue:formData.parttirmers,
            })(<Input placeholder="请输入兼职专业人员" />)}
          </Form.Item>

          <div className={styles["title"]}>联系方式</div>

          <Form.Item label="联系人" hasFeedback>
            {getFieldDecorator('contactor', {
              initialValue:formData.contactor,
              rules: [
                { required: true, message: '请输入联系人!' },
              ],
            })(<Input placeholder="请输入联系人" />)}
          </Form.Item>

          <Form.Item label="联系人电话" hasFeedback>
            {getFieldDecorator('contactphone', {
              initialValue:formData.contactphone,
              rules: [
                { required: true, message: '请输入联系人电话!' },
                {
                  validator: (rule, value, callback) => {
                    const regMobile = /^0?1[3|4|5|6|8][0-9]\d{8}$/
                    if (!regMobile.test(value)) {
                      callback('请输入正确的手机号码!');
                    }
                    callback();
                  },
                },
              ],
            })(<Input placeholder="请输入联系人电话" />)}
          </Form.Item>

          <Form.Item label="办公地址" required>
            {getFieldDecorator('office', {
              initialValue:formData.office?formData.office.split(',') : ['','','',''],
            })(
              <div>
                <Select placeholder="请选择" value={getFieldValue('office')[0]} onChange={(value)=>this.handleChangeProvincial(value,0,'office')}>
                  {this.renderSelectOption(renderProvincialOption())}
                </Select>

                <Select placeholder="请选择" value={getFieldValue('office')[1]} onChange={(value)=>this.handleChangeProvincial(value,1,'office')}>
                  {this.renderSelectOption(renderCityOption(getFieldValue('office')[0]) || {})}
                </Select>

                <Select placeholder="请选择" value={getFieldValue('office')[2]} onChange={(value)=>this.handleChangeProvincial(value,2,'office')}>
                  {this.renderSelectOption(renderCountyOption(getFieldValue('office')[1])  || {})}
                </Select>

                <Input value={getFieldValue('office')[4] || ''} placeholder="请输入" />
              </div>
            )}
          </Form.Item>

          <Form.Item label="资质审核" hasFeedback>
            {getFieldDecorator('qualiaudit', {
              initialValue:formData.qualiaudit,
              rules: [{ required: true, message: '请选择资质审核!' }],
            })(
              <Select placeholder="请选择资质审核">
                {this.renderSelectOption(options.qualiaudit)}
              </Select>
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
