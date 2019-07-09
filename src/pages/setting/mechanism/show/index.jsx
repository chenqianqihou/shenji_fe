import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ShowFields from '../../../../components/ShowFieds'
import styles from './index.less';


@connect(({mechanismShow}) => ({
  mechanismShow,
}))
export default class MechanismShow extends Component {

  componentDidMount(){
  }

  render() {
    const { data } = this.state
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
