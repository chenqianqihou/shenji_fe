import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form } from 'antd';
import NormalField from './components/normal';

@Form.create()
export default class RoleEdit extends Component {
  // eslint-disable-next-line no-useless-constructor

  render() {
    return (
      <div className="role_manager_edit">
        <PageHeaderWrapper />
        <Form className="rm_edit_form">
          {/* 基础信息部分 */}
          <NormalField />
        </Form>
      </div>
    );
  }
}
