// 角色配置

import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tree, Layout, Row, Col, Input, Button, Icon, Table, Divider, Modal, message, Select } from 'antd';
import router from 'umi/router';
import { getProvincialOptions, getOrgList, resetPwd, deleteUsers, queryUser, getUserConfigSelect, updateUserRole } from '../../services/setting';

const { TreeNode } = Tree;
const { Content, Sider } = Layout;
const { Option } = Select;
const treeMapType = {
  1: '中介机构',
  2: '内审机构',
  3: '审计机关',
};
const levelMap = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
};
const typeMap = {
  1: '审计机关',
  2: '内审机构',
  3: '中介机构',
};
let provincial = {};

// eslint-disable-next-line react/prefer-stateless-function
export default class RoleSetting extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      orgListTree: [],
      tableData: [],
      selectedItems: [],
      selectedOrgId: -1,
      searchInputValue: '',
      assignModalShow: false,
      assignRoleList: [],
      assignRoleMap: {},
      assignRoleSelectPid: '',
    };
  }

  componentDidMount() {
    getOrgList().then(res => {
      if (res.error.returnCode === 0) {
        this.setState({ orgListTree: this.formatOrgListTreeOuter(res.data) });
      }
    });
    this.queryUsers();

    getProvincialOptions().then(res => {
      if (res.error.returnCode === 0) {
        provincial = res.data;
      }
    });
  }

  formateProvincial = code => {
    const location = code ? code.split(',') : [];
    let value = '';
    if (location.length !== 3) {
      value = code;
    } else {
      try {
        if (location[0]) value += provincial[100000][location[0]] ? `${provincial[100000][location[0]]}，` : '';
        if (location[1]) value += provincial[location[0]][location[1]] ? `${provincial[location[0]][location[1]]}，` : '';
        if (location[2]) value += provincial[location[1]][location[2]] ? `${provincial[location[1]][location[2]]}，` : '';
      } catch {
        console.log('城市转换错误');
        value = '城市编码错误';
      }
    }
    return value;
  }

  // 树的最外层 三个类型
  formatOrgListTreeOuter = list =>
    <Tree showLine defaultExpandedKeys={['0-0-0']} onSelect={this.onTreeNodeSelect}>
      {list.map(v => <TreeNode title={treeMapType[v.type]} key={v.type} type="parent">
        {
          // eslint-disable-next-line max-len
          Array.isArray(v.list) ? v.list.map(value => this.geneChildTreeNode(value)) : this.geneParentTreeNode(v.list)})
      </TreeNode>)}
    </Tree>

  // 构造树的父亲节点
  geneParentTreeNode = data => {
    const keys = Object.keys(data);
    return keys.map(v =>
      <TreeNode title={data[v].distinct.name} key={v} type="parent">
        {data[v].list.map(value => this.geneChildTreeNode(value))}
      </TreeNode>,
    );
  }

  // 构造树的子节点
  geneChildTreeNode = node => <TreeNode title={node.name} key={node.id} type="child" />;

  getUserListByOrg = orgId => {
    this.queryUsers();
  }

  onTreeNodeSelect = key => {
    this.setState({ selectedOrgId: +key[0] });
    this.getUserListByOrg(key);
  }

  handleItemDel = e => {
    Modal.confirm({
      title: '确定要删除该人员信息？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.deleteOrgUsers([e.pid]);
      },
    });
  }

  deleteOrgUsers = list => {
    deleteUsers({ pid: list }).then(res => {
        if (res.error.returnCode === 0) {
          message.success(res.error.returnUserMessage || '操作成功');
          this.getUserListByOrg(this.state.selectedOrgId);
        } else {
          message.error(res.error.returnUserMessage || '操作失败');
        }
    });
  }

  handleItemAssign = e => {
    const { pid } = e;
    const { assignRoleList } = this.state;
    if (assignRoleList.length === 0) {
      getUserConfigSelect().then(res => {
        if (res.error.returnCode === 0) {
          this.setState({ assignRoleMap: res.data.role, assignRoleList: Object.keys(res.data.role) });
        }
      });
    }
    this.setState({ assignModalShow: true, assignRoleSelectPid: pid });
  }

  handleAssignModalSubmit = () => {
    const { assignRoleSelectPid, assignRoleSelectItem } = this.state;
    updateUserRole({
      pid: assignRoleSelectPid,
      role: assignRoleSelectItem.toString(),
    }).then(res => {
      if (res.error.returnCode === 0) {
        message.success('操作成功');
      } else {
        message.error(res.error.returnUserMessage || '操作失败');
      }
      this.setState({ assignModalShow: false });
    });
  }

  handleItemResetPwd = e => {
    Modal.confirm({
      title: '确定要重置该人员密码？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        resetPwd({ pid: e.pid }).then(res => {
          if (res.error.returnCode === 0) {
            message.success(res.error.returnUserMessage || '操作成功');
          } else {
            message.error(res.error.returnUserMessage || '操作失败');
          }
        });
      },
    });
  }

  handleItemDetail = e => {
    const { pid } = e;
    router.push(`/setting/roleShow?account=${pid}`);
  }

  handleItemUpdate= e => {
    const { pid } = e;
    router.push(`/setting/roleEdit?account=${pid}`);
  }

  // 批量删除
  handleDel = () => {
    Modal.confirm({
      title: '确定要删除这些人员信息？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { selectedItems } = this.state;
        const removeList = selectedItems.map(v => v.pid);
        this.deleteOrgUsers(removeList);
      },
    });
  }

  handleAdd = () => {
    router.push('/setting/roleEdit');
  }

  queryUsers = () => {
    const { searchInputValue, selectedOrgId } = this.state;
    const params = {
      query: searchInputValue,
      length: 1000,
      page: 1,
    };
    if (selectedOrgId < 0) {
      params.organization = 1;
    } else if (selectedOrgId < 4 && selectedOrgId >= 0) {
      params.organization = 2;
      params.type = selectedOrgId;
    } else {
      params.organization = 3;
      params.organid = selectedOrgId;
    }

      queryUser(params).then(res => {
        if (res.error.returnCode === 0) {
          this.setState({ tableData: res.data.list });
        }
      });
  }

  render() {
    const columns = [
      { title: '姓名', dataIndex: 'name' },
      { title: '人员ID', dataIndex: 'pid' },
      { title: '性别', dataIndex: 'sex', render: text => (text === '1' ? '男' : '女') },
      { title: '人员类型', dataIndex: 'type', render: text => text && typeMap[text] },
      { title: '能力等级', dataIndex: 'level', render: text => text && levelMap[text] },
      { title: '所属省市区', dataIndex: 'location', render: text => text && this.formateProvincial(text) },
      { title: '操作',
        dataIndex: 'manage',
        render: (text, record, index) => <span>
          <a onClick={() => this.handleItemDel(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleItemUpdate(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleItemDetail(record)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleItemResetPwd(record)}>重置密码</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleItemAssign(record)}>分配角色</a>
        </span> },
    ];
    const { tableData, orgListTree, assignRoleList, assignRoleMap } = this.state;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
        this.setState({ selectedItems: selectedRows });
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
              {orgListTree}
            </Sider>
          </Col>
          <Col span={16} style={{ marginLeft: '100px' }}>
            <Row style={{ display: 'flex', alignItems: 'center' }}>
              查询条件：
              <Col span={6} style={{ marginRight: '20px' }}>
                <Input
                  placeholder="请输入姓名/人员ID"
                  value={this.state.searchInputValue}
                  onChange={e => { this.setState({ searchInputValue: e.target.value }); }}
                  ></Input>
                </Col>
              <Col span={6}>
                <Button type="primary" onClick={this.queryUsers}>查询</Button>
                <Button style={{ marginLeft: '20px' }} onClick={() => this.setState({ searchInputValue: '' })}>重置</Button>
              </Col>
            </Row>
            <Row style={{ margin: '20px 0' }}>
              <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleAdd}><Icon type="plus" />新增人员</Button>
              <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleDel}><Icon type="delete" />批量删除</Button>
              <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleUpload}><Icon type="upload" />导入人员</Button>
              <Button onClick={this.handleDownload} ><Icon type="arrow-down" />下载模板</Button>
            </Row>
            <Row>
              <Table
                columns={columns}
                rowSelection={rowSelection}
                dataSource={tableData}
              >
              </Table>
            </Row>
          </Col>
        </Row>
        <Modal
          title="分配角色"
          visible={this.state.assignModalShow}
          onCancel={() => this.setState({ assignModalShow: false })}
          onOk={this.handleAssignModalSubmit}
        >
          <Select
            mode="multiple"
            placeholder="请选择角色"
            onChange={e => this.setState({ assignRoleSelectItem: e })}
            style={{ width: '100%' }}
          >
            {
              assignRoleList.length > 0 && assignRoleList.map(v => <Option key={v}>{assignRoleMap[v]}</Option>)

            }
          </Select>
        </Modal>
        </Content>
      </div>
    );
  }
}
