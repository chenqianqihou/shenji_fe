import React, { Component } from 'react';
import styles from './index.less';

export default class ShowFields extends Component {

  componentDidMount(){
  }


  render() {
    const { data } = this.props
    return (
      <div className={styles["fields_main"]}>
        {
          data.map(fieldItem=>(
            <div className={styles["fields_modal"]} key={fieldItem.title}>
              <div className={styles['title']}>{fieldItem.title}</div>
                <div className={styles['rows_contain']}>
                {
                  fieldItem.rows && fieldItem.rows.map((item,index)=>{
                    return(
                    <div style={item.width?{width:item.width}:{}}className={styles['item']} key={`item${index}`} dangerouslySetInnerHTML={{__html:`${item.title}：${item.value}`}}>
                    </div>
                  )})
                }
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
