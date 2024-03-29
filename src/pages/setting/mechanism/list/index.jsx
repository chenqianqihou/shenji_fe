// 机构配置

import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Tree, Layout, Row, Col, Input, Button, Icon, Table, Divider, Select, Modal, message } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';

const { Content } = Layout;
const { Option } = Select;

const typeMap = {
  1: '中介机构',
  2: '内审机构',
};

@connect(({ orgList }) => ({
    orgList,
}))
export default class OrgList extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
        searchInputValue: '', // 查询关键词
        searchType: 1, // 查询类型
        typeMapKeys: Object.keys(typeMap), // 类型key数组
        selectedItems: [], // 选中项数组，用于传参
        selectedRowKeys: [], // 选中项index数组

    };
  }

  componentDidMount() {
    this.getTableData();
  }

  getTableData = (key, type) => {
    const { dispatch } = this.props;
    dispatch({
        type: 'orgList/getOrgLists',
        payload: {
            key,
            type,
            start: 0,
            length: 1000,
        },
    });
  }

  // 单条删除
  handleItemDel = record => {
      this.handleDel([record.id]);
  }

  // 修改
  handleItemUpdate = record => {
    router.push(`/setting/mechanism/edit?oid=${record.id}`);
  }

  // 查看
  handleItemDetail = record => {
      router.push(`/setting/mechanism/show?oid=${record.id}`);
  }

  // 删除多条
  handleDel = list => {
   if ((list || this.state.selectedItems).length === 0) {
    message.error('请至少选择一条');
    return;
   }
    Modal.confirm({
      title: '确定要删除该机构？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'orgList/removeOrgs',
            payload: {
                oid: list || this.state.selectedItems,
            },
            callback: this.getTableData,
        });
      },
    });
  }

  // 新增 跳转
  handleAdd = () => {
    router.push('/setting/mechanism/edit');
  }

  // 批量导入
  handleUpload = () => {

  }

  // 查询按钮
  handleQuery = () => {
    const { searchInputValue, searchType } = this.state;
    this.getTableData(searchInputValue, searchType);
  }

  render() {
    const { orgList } = this.props;
    const { typeMapKeys } = this.state;
    const tableData = orgList.list;

    const columns = [
        { title: '序号', dataIndex: 'index', render: (text, record, index) => index + 1 },
        { title: '机构名称', dataIndex: 'name' },
        { title: '机构类型', dataIndex: 'otype', render: text => typeMap[text] },
        { title: '注册地址', dataIndex: 'regaddress' },
        { title: '注册时间', dataIndex: 'regtime' },
        { title: '注册资金', dataIndex: 'regnum' },
        { title: '开始从业日期', dataIndex: 'workbegin' },
        { title: '操作',
            dataIndex: 'manage',
            render: (text, record, index) => <span>
                <a onClick={() => this.handleItemDel(record)}>删除</a>
                <Divider type="vertical" />
                <a onClick={() => this.handleItemUpdate(record)}>修改</a>
                <Divider type="vertical" />
                <a onClick={() => this.handleItemDetail(record)}>查看</a>
            </span>,
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ selectedRowKeys, selectedItems: selectedRows.map(v => v.id) });
        },
        // selectedRowKeys: this.state.selectedRowKeys,
    };

    return (
      <div>
        <PageHeaderWrapper />
        <Content style={{ margin: '20px 0', background: '#FFF', padding: '20px' }}>

            <Row style={{ display: 'flex', alignItems: 'center' }}>
              <Col span={6} style={{ marginRight: '20px' }}>
                <Input
                  placeholder="请输入"
                  value={this.state.searchInputValue}
                  onChange={e => { this.setState({ searchInputValue: e.target.value }); }}
                ></Input>
              </Col>
              机构类型：
                <Col span={6} >
                    <Select style={{ width: 100 }} defaultValue={typeMapKeys[0]} onChange={e => this.setState({ searchType: e })}>
                        {
                            typeMapKeys.map(v => <Option key={v} value={v}>{typeMap[v]}</Option>)
                        }
                    </Select>
                </Col>
              <Col span={6}>
                <Button type="primary" onClick={this.handleQuery}>查询</Button>
                <Button style={{ marginLeft: '20px' }} onClick={() => this.setState({ searchInputValue: '' })}>重置</Button>
              </Col>
            </Row>

            <Row style={{ margin: '20px 0' }}>
              <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleAdd}><Icon type="plus" />新增机构</Button>
              <Button type="primary" style={{ marginRight: '20px' }} onClick={() => this.handleDel()}><Icon type="delete" />批量删除</Button>
              <Button type="primary" style={{ marginRight: '20px' }} onClick={this.handleUpload}><Icon type="upload" />批量导入</Button>
              {/* <Button onClick={this.handleDownload} ><Icon type="arrow-down" />下载模板</Button> */}
            </Row>

            <Table
                columns={columns}
                dataSource={tableData}
                rowSelection={rowSelection}
                >
            </Table>
        </Content>
      </div>
    );
  }
}
