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

//Functions for data transffer between the client and the server.
function get() {
  return fetch('/topics', {
    method: 'get'
  }).then(function(response) {
      if(response.ok) {
        return response.json();
    } else throw new Error('There was a problem with network connection.');
  }).then(function(json) {
      let d = new Date(json[0].created);
      document.getElementById('get').innerHTML = 'Got data! '+'ID: '+json[0].id+' Title: '+json[0].title+' Description: '+json[0].Description+ ' Created: '+d.toUTCString();
  });
}

function post() {
  var date = new Date();
  return fetch('/topics', {
    method: 'post',
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify({id:'1', title:'Posted topic', Description: 'Abutere...', created: date})
  }).then(function(response) {
      if(response.ok) {
        return response.json();
    } else throw new Error('There was a problem with network connection.');
  }).then(function(json) {
      let d = new Date(json.created);
      document.getElementById('post').innerHTML = 'Data sent successfully! '+'ID: '+json.id+' Title: '+json.title+' Description: '+json.Description+ ' Created: '+d.toUTCString();
  });
}

function put() {
  var date = new Date();
  return fetch('/topics/0', {
    method: 'put',
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify({id:'1', title:'Posted topic', Description: 'Abutere...', created: date})
  }).then(function(response) {
      if(response.ok) {
        return response.json();
    } else throw new Error('There was a problem with network connection.');
  }).then(function(json) {
      let d = new Date(json.created);
      document.getElementById('put').innerHTML = 'Data updated! '+'ID: '+json.id+' Title: '+json.title+' Description: '+json.Description+ ' Created: '+d.toUTCString();
  });
}

function del() {
  return fetch('/topics/0', {
    method: 'delete'
  }).then(function(response) {
      if(response.ok) document.getElementById('del').innerHTML = 'Data deleted! '+response.status;
    else throw new Error('There was a problem with network connection.')
    });
}

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
            <Button type="primary" id="get" onClick={get}>GET</Button>
            <Button type="primary" id="post" onClick={post}>POST</Button>
            <Button type="primary" id="put" onClick={put}>PUT</Button>
            <Button type="primary" id="del" onClick={del}>DELETE</Button>
          </div>
        </div>
      </div>

    );
  }
}

export default App;
