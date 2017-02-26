import React, { Component } from 'react';
import { Button } from 'antd';
import { Form } from 'antd';
import { Table } from 'antd';
import { Icon } from 'antd';
import titleimg from './titleimg.png'; //source: http://www.clker.com/cliparts/a/1/3/8/11949859511240324938open_book_nae_02.svg.hi.png
import './App.css';

const data = [{
    key: 1,
    id: `Edward King`,
    date: 32,
    title: `London, Park Lane no.`,
    action: 'Delete',
},];

const cols = [{
  title: '#ID',
  dataIndex: 'id',
  key: 'id',
}, {
  title: 'Date',
  dataIndex: 'date',
  key: 'date',
}, {
  title: 'Topic title',
  dataIndex: 'title',
  key: 'title',
}, {
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];

const selection = {
  onChange: (selectedRowKeys, selectedRows) => {
    //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    //console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    //console.log(selected, selectedRows, changeRows);
  },
  getCheckboxProps: record => ({
    //disabled: record.name === 'Disabled User',    // Column configuration not to be checked
  }),
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={titleimg} className="App-titleimg" alt="titleimg" />
          <p className="App-title">Thesis Portal</p>
        </div>
        <div className="App-body">
          <div className="App-body-table">
           <Table
            rowSelection={selection}
            expandedRowRender={record => <p>{record.description}</p>}
            dataSource={data}
            columns={cols}
            size="middle"
            pagination={ false }
            //scroll={{ y: 240 }}
            bordered />
          </div>
        </div>
      </div>

    );
  }
}

export default App;
