//基础信息模块
import React, { Component } from 'react';
import { Input, Form } from 'antd';
import { cardValid } from '../../../../../utils/form';

@Form.create()
export default class NormalField extends Component {
  render() {
    const { getFieldDecorator } = this.form;
    return (
      <div className="form-field">
        <div className="title">基础信息</div>
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
          })(<Input placeholder="请输入身份证号" />)}
        </Form.Item>

        <Form.Item label="手机号" hasFeedback>
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: '请输入手机号!' },
              {
                type: 'phone',
                message: '请输入正确的手机号!',
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
      </div>
    );
  }
}
