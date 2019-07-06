// 机构配置

import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tree, Layout, Row, Col, Input, Button, Icon, Table, Divider } from 'antd';
import { userSelect } from '../../services/setting';

const { TreeNode } = Tree;
const { Content, Sider } = Layout;
// eslint-disable-next-line react/prefer-stateless-function
export default class OrgSetting extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // userSelect().then(res => {
    //   console.log(res);
    // });
  }

  handleItemDel = e => {
    console.log(e);
  }

  render() {
    const tree = <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onSelect}>
      <TreeNode title="parent 1" key="0-0">
        <TreeNode title="parent 1-0" key="0-0-0">
          <TreeNode title="leaf" key="0-0-0-0" />
          <TreeNode title="leaf" key="0-0-0-1" />
          <TreeNode title="leaf" key="0-0-0-2" />
        </TreeNode>
        <TreeNode title="parent 1-1" key="0-0-1">
          <TreeNode title="leaf" key="0-0-1-0" />
        </TreeNode>
        <TreeNode title="parent 1-2" key="0-0-2">
          <TreeNode title="leaf" key="0-0-2-0" />
          <TreeNode title="leaf" key="0-0-2-1" />
        </TreeNode>
      </TreeNode>
    </Tree>;

    const columns = [
      { title: '姓名', dataIndex: 'name' },
      { title: '人员ID', dataIndex: 'id' },
      { title: '性别', dataIndex: 'sex' },
      { title: '人员类型', dataIndex: 'type' },
      { title: '能力等级', dataIndex: 'level' },
      { title: '所属省市区', dataIndex: 'belong' },
      { title: '操作',
        dataIndex: 'manage',
        render: () => <span>
          <a onClick={this.handleItemDel}>删除</a>
          <Divider type="vertical" />
          <a>编辑</a>
          <Divider type="vertical" />
          <a>详情</a>
          <Divider type="vertical" />
          <a>重置密码</a>
          <Divider type="vertical" />
          <a>分配角色</a>
        </span> },
    ];

    const data = [
      {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      },
      {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      },
      {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      },
      {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      },
      {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      },
      {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      }, {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      },
      {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      }, {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      }, {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      }, {
        name: '111',
        id: '111',
        sex: '111',
        type: 'type',
        level: '1',
        belong: 'aaa',
        manage: '1',
      },
    ];


    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div>
        <PageHeaderWrapper />
        <Content style={{ margin: '20px 0', background: '#FFF', padding: '20px' }}>
        <Row>
          <Col span={4}>
            <Sider style={{ background: '#fff', borderRight: '1px solid #CCC' }}>
              {tree}
            </Sider>
          </Col>
          <Col span={18}>
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <Col span={2}>查询条件：</Col>
              <Col span={6} style={{ marginRight: '20px' }}><Input placeholder="请输入姓名/人员ID"></Input></Col>
              <Col span={2}><Button type="primary">查询</Button></Col>
              <Col span={2}><Button >重置</Button></Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
              <Col span={3}><Button type="primary"><Icon type="plus" />新增人员</Button></Col>
              <Col span={3}><Button type="primary">批量删除</Button></Col>
              <Col span={3}><Button type="primary">导入人员</Button></Col>
              <Col span={3}><Button ><Icon type="arrow-down" />下载模板</Button></Col>
            </Row>
          </Col>
          <Col span={18} style={{ marginTop: '20px' }}>
            <Table
              columns={columns}
              rowSelection={rowSelection}
              dataSource={data}
            >
            </Table>
          </Col>
        </Row>
        </Content>
      </div>
    );
  }
}
