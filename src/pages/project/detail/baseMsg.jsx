import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment'
import {Icon,Button,Modal,Form,DatePicker,Input} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ShowFields from '../../../components/ShowFieds'
import styles from './index.less';
import {provincialName } from '../../../utils/url';


const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
};
const { TextArea } = Input;


@connect(({projectDetail}) => ({
  projectDetail,
}))
@Form.create()
export default class BaseMsg extends Component {

  state = {
    modalVisible:false
  }
  componentDidMount(){
  }

  handleShowModal = ()=>{
    this.setState({
      modalVisible:true
    })
  }

  handleCloseModal = ()=>{
    this.setState({
      modalVisible:false
    })
  }

  handleSaveModal = ()=>{
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const sendValues = Object.assign({},values)
        const projstart = sendValues.projstart = values.projstart.unix()

        dispatch({
          type: 'projectDetail/updateProjectStatus',
          payload:sendValues
        })
      }
    });
  }

  render() {
    const {modalVisible} = this.state
    const { form: { getFieldDecorator, getFieldValue },
      projectDetail:{projectData:{head={},basic={}},projectStatus}} = this.props
    return (
      <div className={styles["base-msg"]}>
        <div className={styles['line']}>
          <div className={styles['title']}>项目描述：</div>
          <div className={styles['content']}>{basic.projdesc}</div>
        </div>
        <div className={styles['card']}>
          <Button type="primary" onClick={this.handleShowModal}>编辑</Button>
          <div className={styles['line']}>
            <div className={styles['title']}>开始时间：</div>
            <div className={styles['content']}>{basic.projstart?moment(basic.projstart*1000).format('XXXX年MM月DD日'):''}</div>
          </div> 
          <div className={styles['line']}>
            <div className={styles['title']}>审计内容：</div>
            <div className={styles['content']}>{basic.projauditcontent}</div>
          </div> 
        </div>

        <Modal
          title='修改信息'
          visible={modalVisible}
          cancelText="取消"
          okText="确定"
          onCancel={this.handleCloseModal}
          onOk={this.handleSaveModal}
        >
          <Form {...formItemLayout}>

            <Form.Item label="开始时间" hasFeedback>
              {getFieldDecorator('projstart', {
                initialValue:basic.projstart?moment(basic.projstart * 1000):null,
              })(
                <DatePicker allowClear={false}/>
              )}
            </Form.Item>

            <Form.Item label="审计内容" hasFeedback>
              {getFieldDecorator('projstart', {
                initialValue: basic.projstart,
              })(<TextArea rows={6}/>)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
