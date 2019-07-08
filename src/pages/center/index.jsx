import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import RoleShowFileds from '../../bizComponents/RoleShowFileds'
import { Tabs,Form ,Input, Button} from 'antd'
import { connect } from 'dva';
import styles from './index.less';

const { TabPane } = Tabs

@Form.create()
@connect(({roleShow}) => ({
  roleShow,
}))
export default class UserCenter extends Component {

  componentDidMount(){
  }

  handleSubmit = e => {
    const {dispatch} = this.props
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
     
      if (!err) {
        const sendValues = {}
        sendValues.old = values.oldPassword
        sendValues.new = values.newPassword
        dispatch({
          type: 'roleShow/submitPwd',
          payload:{
            ...sendValues
          }
        });
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const { form:{getFieldDecorator,getFieldValue}} = this.props;
    return (
      <div className={styles["role_center"]}>
        <PageHeaderWrapper />
        <Tabs defaultActiveKey="1" className={styles["role_center_tab"]}>
          <TabPane tab="个人资料" key="1">
            <RoleShowFileds/>
          </TabPane>
          <TabPane tab="修改密码" key="2">

            <Form {...formItemLayout} className={styles["update_password_form"]} onSubmit={this.handleSubmit}>
              
              <Form.Item label="原密码" hasFeedback>
                {getFieldDecorator('oldPassword', {
                  rules: [{ required: true, message: '请输入原密码!' }],
                })(<Input placeholder="请输入原密码" type="password"/>)}
              </Form.Item>

              <Form.Item label="新密码" hasFeedback>
                {getFieldDecorator('newPassword', {
                  rules: [{ required: true, message: '请输入新密码!' }],
                })(<Input placeholder="请输入新密码" type="password"/>)}
              </Form.Item>

              <Form.Item label="再次确认新密码" hasFeedback required>
                {getFieldDecorator('newPassword2', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value !== getFieldValue('newPassword')) {
                          callback('两次输入的密码不一致!');
                        }
                        callback();
                      },
                    },
                  ],
                })(<Input placeholder="请再次输入新密码" type="password"/>)}
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>

          </TabPane>
        </Tabs>
      </div>
    );
  }
}
