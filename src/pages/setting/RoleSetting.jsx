// 角色配置

import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tree, Layout, Row, Col, Input, Button, Icon, Table, Divider, Modal, message, Select, Tabs, Tag } from 'antd';
import router from 'umi/router';
import { getOrgList, resetPwd, deleteUsers, queryUser, getUserConfigSelect, updateUserRole } from '../../services/setting';
import { quickAddOrg, quickEditOrg, delOrg } from './mechanism/list/service';
import { levelMap, typeMap } from '../../utils/conts';
import { provincialName } from '../../utils/url';

const { TreeNode } = Tree;
const { Content, Sider } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

const getObjectValues = obj => {
  if (obj !== undefined && obj !== null && !Array.isArray(obj)) {
    return Object.values(obj);
  }
  return [];
};

// eslint-disable-next-line react/prefer-stateless-function
export default class RoleSetting extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      orgListTree: [],
      orgListTreeType3: [], // 第三方机构树结构
      tableData: [],
      selectedItems: [],
      selectedItemsKeys: [],
      selectedOrgId: -1,
      searchInputValue: '',
      assignModalShow: false,
      assignRoleList: [],
      assignRoleMap: {},
      assignRoleSelectPid: '',
      addOrgDialog: false,
      addOrgDialogInputValue: '',
      addOrgDialogPid: 0,
      addOrgDialogTitle: '',
      activeTabId: 1,
    };
  }

  componentDidMount() {
    this.initTreeData();
    this.queryUsers();
  }

  // 初始化树解构
  initTreeData = () => {
    getOrgList().then(res => {
      if (res.error.returnCode === 0) {
        const type3Data = [res.data.pop()];
        console.log(type3Data);
        try {
          this.setState({ 
            orgListTree: this.formatOrgListTreeOuter(res.data), 
            orgListTreeType3: this.formatOrgListTreeOuter(type3Data, false)
          });
        } catch (e) {
          console.log('error', e);
        }
      }
    });
  }

  // 树的最外层 三个类型
  formatOrgListTreeOuter = (data, pro) => <Tree showLine onSelect={this.onTreeNodeSelect}>

      {
        data.map(v => {
          const childList = getObjectValues(v.list.list);
          return <TreeNode title={typeMap[v.type]} key={v.type} type="parent">
            {childList.map(value => (value.type === 'parent' ? this.geneParentNode(value) : this.geneChildNode(value)))}
          </TreeNode>;
        })
      }
    </Tree>

  // 构造树的父亲节点
  geneParentNode = (data, pro) => {
    // 自己的列表
    const list = getObjectValues(data.list);
    return <TreeNode title={pro ? this.nodePro(data) : data.name} key={data.id} type={data.type}>
        {
          list.map(v => (v.type === 'parent' ? this.geneParentNode(v) : this.geneChildNode(v)))
        }
    </TreeNode>;
  }

  // 构造树的子节点
  geneChildNode = node => <TreeNode title={node.name} key={node.id} type="child" />

  // 节点的title是自定义的，要有增删改查
  nodePro = data => <span>
    {data.name}
    {data.id < 100000 && <Icon onClick={e => this.handleTreeNodeClick(e, data, 'add')} style={{ marginLeft: '5px' }} type="plus"/>}
    {data.id < 100000 && <Icon onClick={e => this.handleTreeNodeClick(e, data, 'del')} style={{ marginLeft: '5px' }} type="delete"/>}
    {data.id < 100000 && <Icon onClick={e => this.handleTreeNodeClick(e, data, 'edit')} style={{ marginLeft: '5px' }} type="edit"/>}
    </span>

  handleTreeNodeClick = (e, data, type) => {
    const { id, name } = data;

    if (type === 'add') {
      this.setState({ addOrgDialog: true, addOrgDialogPid: id, addOrgDialogTitle: '新增机构' });
    } else if (type === 'edit') {
      this.setState({ addOrgDialog: true, addOrgDialogPid: id, addOrgDialogTitle: '修改机构', addOrgDialogInputValue: name });
    } else if (type === 'del') {
      Modal.confirm({
        title: '确定删除该机构？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          delOrg({ oid: [id] }).then(res => {
            if (res.error.returnCode === 0) {
              this.initTreeData();
              message.success('操作成功');
            }
          });
        },
      });
    }

    e.stopPropagation();
  }

  // 树节点新增机构
  handleAddOrgDialogSubmit = () => {
    const { addOrgDialogInputValue, addOrgDialogPid } = this.state;

    if (!addOrgDialogInputValue) {
      message.error('请输入机构名称');
      return;
    }

    quickAddOrg({
      pid: addOrgDialogPid,
      name: addOrgDialogInputValue,
    }).then(res => {
      if (res.error.returnCode === 0) {
        message.success('操作成功');
        this.initTreeData();
        this.setState({ addOrgDialog: false, addOrgDialogInputValue: '' });
      }
    });
  }

  // 树节更新机构
  handleEditOrgDialogSubmit = () => {
    const { addOrgDialogInputValue, addOrgDialogPid } = this.state;

    if (!addOrgDialogInputValue) {
      message.error('请输入机构名称');
      return;
    }

    quickEditOrg({
      id: addOrgDialogPid,
      name: addOrgDialogInputValue,
    }).then(res => {
      if (res.error.returnCode === 0) {
        message.success('操作成功');
        this.initTreeData();
        this.setState({ addOrgDialog: false, addOrgDialogInputValue: '' });
      }
    });
  }

  getUserListByOrg = orgId => {
    this.queryUsers();
  }

  onTreeNodeSelect = key => {
    if (key.length === 0) {
      return;
    }
    this.setState({ selectedOrgId: +key[0] }, () => this.queryUsers());
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
    if (list.length === 0) {
      message.error('请选择至少一项');
      return;
    }
    deleteUsers({ pid: list }).then(res => {
        if (res.error.returnCode === 0) {
          message.success(res.error.returnUserMessage || '操作成功');
          this.queryUsers();
        } else {
          message.error(res.error.returnUserMessage || '操作失败');
        }
    });
  }

  handleItemAssign = e => {
    const { pid } = e;
    const { assignRoleList } = this.state;
    // 获取人员配置列表中的 role
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
    const { searchInputValue, selectedOrgId, activeTabId } = this.state;
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

    if(activeTabId === '2' && selectedOrgId < 0){
      params.organization = 2;
      params.type = 1;
    }

      queryUser(params).then(res => {
        if (res.error.returnCode === 0) {
          this.setState({ tableData: res.data.list });
        }
      });
  }

  handleTabChange = e => {
    this.setState({activeTabId: e}, () => this.queryUsers());
  }

  render() {
    const columns = [
      { title: '姓名', dataIndex: 'name' },
      { title: '人员ID', dataIndex: 'pid' },
      { title: '性别', dataIndex: 'sex', render: text => (text === '1' ? '男' : '女') },
      { title: '所属机构', dataIndex: 'organization' },
      { title: '所属部门', dataIndex: 'department' },
      { title: '工作状态', dataIndex: 'status', render: text => text === 1 ? <Tag color="green">在点</Tag> : <Tag color="red">不在点</Tag>},
      { title: '在途项目', dataIndex: 'projectnum' },
      { title: '操作',
        dataIndex: 'manage',
        fixed: 'right',
        width: 180,
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
          <Divider type="vertical" />
          <a onClick={() => this.handleItemAssign(record)}>分配项目</a>
        </span> },
    ];
    const {
      tableData,
      orgListTree,
      orgListTreeType3,
      assignRoleList,
      assignRoleMap,
      selectedItemsKeys,
      addOrgDialogTitle,
    } = this.state;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedItems: selectedRows, selectedItemsKeys: selectedRowKeys });
      },
      selectedRowKeys: selectedItemsKeys,
    };

    return (
      <div>
        <PageHeaderWrapper />
        <Content style={{ margin: '20px 0', background: '#FFF', padding: '20px' }}>
        <Tabs defaultActiveKey="1" onChange={e => this.handleTabChange(e)}>
          <TabPane tab="审计机关" key="1">
            <Row>
              <Col span={4}>
                <Sider style={{ background: '#fff' }}>
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
                    scroll={{ x: 1000 }}
                  >
                  </Table>
                </Row>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="第三方机构" key="2">
          <Row>
              <Col span={4}>
                <Sider style={{ background: '#fff' }}>
                  {orgListTreeType3}
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
                    scroll={{ x: 1000 }}
                  >
                  </Table>
                </Row>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
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
        <Modal
          title={addOrgDialogTitle}
          visible={this.state.addOrgDialog}
          onCancel={() => this.setState({ addOrgDialog: false })}
          onOk={addOrgDialogTitle === '新增机构' ? this.handleAddOrgDialogSubmit : this.handleEditOrgDialogSubmit}
        >
          <Input placeholder="请输入机构名称" value={this.state.addOrgDialogInputValue} onChange={e => this.setState({ addOrgDialogInputValue: e.target.value })} />
        </Modal>
        </Content>
      </div>
    );
  }
}
