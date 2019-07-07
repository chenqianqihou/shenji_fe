import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Form, Select,DatePicker ,InputNumber,Button} from 'antd';
import moment from 'moment'
import { cardValid, UserId2Birthday,UserId2Age,UserId2Sex } from '../../../utils/form';
import styles from './index.less';

const TextArea = Input.TextArea
// eslint-disable-next-line react/prefer-stateless-function
@Form.create()
@connect(({roleEdit}) => ({
  roleEdit,
}))
export default class RoleEdit extends Component {
  state= {
    disabled:false,
    roleType:'',
    professionTechnicalNum:1,
    trainingContentNum:1
  }
  
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type: 'roleEdit/getOptions',
    });
  }

  inputUserIDNum = (e)=>{
    const value = e.target.value

    if(cardValid(value)){
      // debugger
      this.props.form.setFieldsValue({
        sex: UserId2Sex(value),
        age:UserId2Age(value),
        birthday:moment(UserId2Birthday(value))
      })
      this.setState({
        disabled:true
      })
    }
  }

  handleChangeProvincial = (value,index)=>{
    const { form:{getFieldValue,setFieldsValue} } = this.props;
    const newProvincial = [].concat(getFieldValue('provincial_city'))
    newProvincial[index] = value

    for(let i = index+1;i<3;i++){
      newProvincial[i] = ''
    }
    setFieldsValue({
      provincial_city: newProvincial,
    })
  }

  handleChangeRoleType = (value)=>{
    this.setState({
      roleType:value
    })
  }

  handleAddFiledsNum = (props)=>{
    const newState = Object.assign({},this.state)
    newState[props] = this.state[props] + 1
    this.setState(newState)
  }

  handleDeleteFiledsNum= (props)=>{
    const newState = Object.assign({},this.state)
    newState[props] = this.state[props] - 1
    this.setState(newState)
  }

  

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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

  /* 专业技术资质（选填）：手动填写，可添加多个 获取专业技术资质日期（选填）：日历选择
【专业技术资质】与【获取专业技术资质日期】属联动关系、添加一个“专业技术资质”便同步增加“获取专业技术资质日期”选框*/
  renderProfessionTechnical(){
    const {professionTechnicalNum} = this.state
    const { form:{getFieldDecorator,getFieldValue},roleEdit:{options} } = this.props;

    const dom = []
    for(let i = 0;i<professionTechnicalNum;i++){
      dom.push(
        <div className={styles["add_fields"]}>
          <Form.Item label={`专业技术资质${i+1}`}>
            {getFieldDecorator(`abcde_${i}`, {
            })( <Input placeholder="请输入专业技术资质" />)}
          </Form.Item>

          <Form.Item label="获取专业技术资质日期" required>
            {getFieldDecorator(`abcdefg_${i}`, {
              rules:[
                {
                  validator: (rule, value, callback) => {
                    console.log('aaaaa',getFieldValue(`abcde_${i}`),value && getFieldValue(`beginJobTime_${i}`))
                    if (!value && getFieldValue(`abcde_${i}`)) {
                      callback('请选择获取专业技术资质日期!');
                    }
                    callback();
                  },
                }
              ]
            })( <DatePicker />)}
          </Form.Item>
          {
            i === professionTechnicalNum-1
            ?<Button className={styles["add-button"]} onClick={()=>this.handleAddFiledsNum('professionTechnicalNum')}>添加</Button>
            :<Button type="danger" className={styles["add-button"]} onClick={()=>this.handleDeleteFiledsNum('professionTechnicalNum')}>删除</Button>
          }
          

        </div>
      )
    }
    return dom
  }

  renderTrainingContent(){
    const {trainingContentNum} = this.state
    const { form:{getFieldDecorator},roleEdit:{options} } = this.props;

    const dom = []
    for(let i = 0;i<trainingContentNum;i++){
      dom.push(
        <div className={styles["add_fields"]}>
          <Form.Item label={i === 0?`业务培训情况`:' '}>
            {getFieldDecorator(`beginJobTime_${i}`, {
            })( <Input placeholder="请输入业务培训情况" />)}
          </Form.Item>

          {
            i === trainingContentNum-1
            ?<Button className={styles["add-button"]} onClick={()=>this.handleAddFiledsNum('trainingContentNum')}>添加</Button>
            :<Button type="danger" className={styles["add-button"]} onClick={()=>this.handleDeleteFiledsNum('trainingContentNum')}>删除</Button>
          }
        </div>
      )
    }
    return dom
  }

  renderDeficitFileds(){
    const { roleType } = this.state
    const { form:{getFieldDecorator},roleEdit:{options} } = this.props;
    switch(parseInt(roleType)){
      //审计机关
      case 1:
        return(
          <div>
            <Form.Item label="所属部门" hasFeedback>
              {getFieldDecorator('department', {
                rules: [{ required: true, message: '请输入所属部门!' }],
              })(<Input placeholder="请输入所属部门" />)}
            </Form.Item>

            <Form.Item label="现任职务" hasFeedback>
              {getFieldDecorator('position', {
                rules: [
                  { required: true, message: '请选择现任职务!' },
                ],
              })(
                <Select placeholder="请选择现任职务"> 
                  {this.renderSelectOption(options.position)}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="岗位性质" hasFeedback>
              {getFieldDecorator('nature', {
                rules: [
                  { required: true, message: '请选择岗位性质!' },
                ],
              })(
                <Select placeholder="请选择岗位性质"> 
                  {this.renderSelectOption(options.nature)}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="专业技术职称" hasFeedback>
              {getFieldDecorator('techtitle', {
              })(
                <Select placeholder="请选择专业技术职称" mode="multiple"> 
                  {this.renderSelectOption(options.techtitle)}
                </Select>
              )}
            </Form.Item>

            <Form.Item label="审计特长" hasFeedback>
              {getFieldDecorator('expertise', {
              })(
                <Select placeholder="请选择审计特长" mode="multiple"> 
                  {this.renderSelectOption(options.expertise)}
                </Select>
              )}
            </Form.Item>

            {this.renderTrainingContent()}

            <Form.Item label="参加工作年月" hasFeedback>
              {getFieldDecorator('jobTime', {
              })( <DatePicker />)}
            </Form.Item>

            <Form.Item label="参加审计年月" hasFeedback>
              {getFieldDecorator('auditTime', {
              })( <DatePicker />)}
            </Form.Item>
            
            
          </div>
        )
      //内审机构
      //中介机构
      case 3:
      case 2:
        return(
          <div>
            <Form.Item label="现任职务" hasFeedback>
              {getFieldDecorator('positiontext', {
              })(
                <Input placeholder="请输入现任职务" />
              )}
            </Form.Item>

            <Form.Item label="开始从业日期" hasFeedback>
              {getFieldDecorator('beginJobTime', {
                rules:[
                  { type: 'object',required: true, message: '请选择开始从业日期!' },
                ]
              })( <DatePicker />)}
            </Form.Item>

            <Form.Item label="专业特长" hasFeedback>
              {getFieldDecorator('positiontext', {
                rules:[
                  { type: 'object',required: true, message: '请选择开始从业日期!' },
                ]
              })(
                <Input placeholder="请输入专业特长" />
              )}
            </Form.Item>
            
            {this.renderProfessionTechnical()}

            <Form.Item label="近三年主要业绩" hasFeedback>
              {getFieldDecorator('beginJobTime', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      if (value && value.length>200) {
                        callback('最多可输入200个字!');
                      }
                      callback();
                    },
                  },
                ],
              })( <TextArea rows={4} maxlength={200} placeholder="请输入近三年主要业绩,最多200个字"/>)}
            </Form.Item>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const {disabled} = this.state
    const { form:{getFieldDecorator,getFieldValue},roleEdit:{options,provincial} } = this.props;
    const provincialOption = provincial['100000'] || {}

    console.log('options',options,provincial)
    return (
      <div className={styles["role_manager_edit"]}>
        <PageHeaderWrapper />
        <Form {...formItemLayout} className={styles["rm_edit_form"]} onSubmit={this.handleSubmit}>
          <div className={styles["title"]}>基础信息</div>
          <Form.Item label="姓名" hasFeedback>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入姓名!' }],
            })(<Input placeholder="请输入姓名" />)}
          </Form.Item>

          <Form.Item label="身份证号" hasFeedback>
            {getFieldDecorator('userIDNum', {
              rules: [
                { required: true, message: '请输入身份证号!' },
                {
                  validator: (rule, value, callback) => {
                    if (!cardValid(value)) {
                      callback('请输入正确的身份证号码!');
                    }
                    callback();
                  },
                },
              ],
            })(<Input placeholder="请输入身份证号" onChange={this.inputUserIDNum}/>)}
          </Form.Item>

          <Form.Item label="性别" hasFeedback>
            {getFieldDecorator('sex', {
              rules: [
                { required: true, message: '请选择性别!' },
              ],
            })(
              <Select placeholder="请选择性别" disabled={disabled}>
                <Select.Option value="man">男</Select.Option>
                <Select.Option value="woman">女</Select.Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item label="出生年月" hasFeedback>
            {getFieldDecorator('birthday', {
              rules: [
                { type: 'object',required: true, message: '请选择出生年月!' },
              ],
            })(
            <DatePicker disabled={disabled}/>
            )}
          </Form.Item>

          <Form.Item label="年龄" hasFeedback>
            {getFieldDecorator('age', {
              rules: [{ required: true, message: '请输入年龄!' }],
            })(
              <Input placeholder="请输入年龄" disabled={disabled}/>
            )}
          </Form.Item>

          <Form.Item label="手机号" hasFeedback>
            {getFieldDecorator('phone', {
              rules: [
                { required: true, message: '请输入手机号!' },
                {
                  validator: (rule, value, callback) => {
                    const regMobile = /^0?1[3|4|5|6|8][0-9]\d{8}$/
                    if (!regMobile.test(value)) {
                      callback('请输入正确的身份证号码!');
                    }
                    callback();
                  },
                },
              ],
            })(<Input placeholder="请输入手机号" />)}
          </Form.Item>

          <Form.Item label="邮箱" hasFeedback>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: '请输入邮箱!' },
                {
                  type: 'email',
                  message: '请输入正确的邮箱格式!',
                },
              ],
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>

          <Form.Item label="联系地址" hasFeedback>
            {getFieldDecorator('address', {
              rules: [{ required: true, message: '请输入联系地址!' }],
            })(<Input placeholder="请输入联系地址" />)}
          </Form.Item>

          <div className={styles["title"]}>教育信息</div>

          <Form.Item label="学历" hasFeedback>
            {getFieldDecorator('education', {
              rules: [
                { required: true, message: '请选择学历!' },
              ],
            })(
              <Select placeholder="请选择学历">
                {this.renderSelectOption(options.education)}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="毕业学校" hasFeedback>
            {getFieldDecorator('graduation', {
              rules: [
                { required: true, message: '请输入毕业学校!' },
              ],
            })(
              <Input placeholder="请输入毕业学校" />
            )}
          </Form.Item>

          <Form.Item label="所学专业" hasFeedback>
            {getFieldDecorator('major', {
              rules: [
                { required: true, message: '请输入所学专业!' },
              ],
            })(
              <Input placeholder="请输入所学专业" />
            )}
          </Form.Item>

          <Form.Item label="政治面貌" hasFeedback>
            {getFieldDecorator('political', {
              rules: [
                { required: true, message: '请选择政治面貌!' },
              ],
            })(
              <Select placeholder="请选择政治面貌">
                {this.renderSelectOption(options.political)}
              </Select>
            )}
          </Form.Item>

          <div className={styles["title"]}>职能信息</div>
          
          <Form.Item label="所属省市区" required>
            {getFieldDecorator('provincial_city', {
              initialValue:['','',''],
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
                <Select placeholder="请选择" value={getFieldValue('provincial_city')[0]} onChange={(value)=>this.handleChangeProvincial(value,0)}>
                  {this.renderSelectOption(provincialOption)}
                </Select>

                <Select placeholder="请选择" value={getFieldValue('provincial_city')[1]} onChange={(value)=>this.handleChangeProvincial(value,1)}>
                  {this.renderSelectOption(provincial[getFieldValue('provincial_city')[0]] || [])}
                </Select>

                <Select placeholder="请选择" value={getFieldValue('provincial_city')[2]} onChange={(value)=>this.handleChangeProvincial(value,2)}>
                  {this.renderSelectOption(provincial[getFieldValue('provincial_city')[1]] || [])}
                </Select>
              </div>
            )}
          </Form.Item>

          <Form.Item label="能力等级" hasFeedback>
            {getFieldDecorator('level', {
            })(
              <Select placeholder="请选择能力等级">
                {this.renderSelectOption(options.level)}
              </Select>
            )}
          </Form.Item>

          <Form.Item label="人员类型" hasFeedback>
            {getFieldDecorator('roleType', {
              rules: [
                { required: true, message: '请选择人员类型!' },
              ],
            })(
              <Select placeholder="请选择人员类型" onChange={this.handleChangeRoleType}> 
                {this.renderSelectOption(options.level)}
              </Select>
            )}
          </Form.Item>

          {this.renderDeficitFileds()}

          <div className={styles["title"]}>其他信息</div>

          <Form.Item label="备注" hasFeedback>
            {getFieldDecorator('aaa', {
            })(
              <TextArea rows={4} maxlength={200} placeholder="请输入备注,最多200个字"/>
            )}
          </Form.Item>

          <Form.Item label="角色配置" hasFeedback>
            {getFieldDecorator('bbb', {
              rules: [
                { required: true, message: '请选择角色配置!' },
              ],
            })(
              <Select placeholder="请选择角色配置"> 
                {this.renderSelectOption(options.level)}
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
