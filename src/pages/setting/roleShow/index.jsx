import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import RoleShowFileds from '../../../bizComponents/RoleShowFileds'
import styles from './index.less';


export default class RoleShow extends Component {

  componentDidMount(){
  }

  render() {
    return (
      <div className={styles["role_manager_show"]}>
        <PageHeaderWrapper />
        <div className={styles["role_manager-contain"]}>
          <RoleShowFileds/>
        </div>
      </div>
    );
  }
}
