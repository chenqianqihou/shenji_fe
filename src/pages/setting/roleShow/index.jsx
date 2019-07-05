import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

// eslint-disable-next-line react/prefer-stateless-function
export default class RoleShow extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="role_manager_show">
        <PageHeaderWrapper />
      </div>
    );
  }
}
