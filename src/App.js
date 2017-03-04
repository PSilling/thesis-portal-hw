import React, { Component } from 'react';
import { Button, Table, Form, Input, Modal } from 'antd';
import titleimg from './titleimg.png'; //source: http://www.clker.com/cliparts/a/1/3/8/11949859511240324938open_book_nae_02.svg.hi.png
import './App.css';

const FormItem = Form.Item;

const cols = [{
  title: '#ID',
  dataIndex: 'key',
  key: 'key',
  width: 40,
}, {
  title: 'Created',
  dataIndex: 'created',
  key: 'created',
  width: 200,
}, {
  title: 'Topic title',
  dataIndex: 'title',
  key: 'title',
  width: 150,
}, {
  title: 'Description',
  dataIndex: 'description',
  key: 'description'/*,
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
  ),**/
}];

const PostForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    const width = window.innerWidth - 300;
    return (
      <Modal
        visible={visible}
        title="New thesis"
        okText="Create"
        cancelText="Cancel"
        width={width}
        onOk={onCreate}
        onCancel={onCancel}
      >
        <Form vertical>
          <FormItem label="Title">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Thesis title is required!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('Description', {
              rules: [{ required: true, message: 'Thesis description is required!' }],
            })(
              <Input type="textarea" rows={5}/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

function MainTable(props) {
    const height = window.innerHeight - 275;
    return <Table
        className="table"
        dataSource={props.data}
        columns={cols}
        size="middle"
        pagination={ false }
        scroll={{ y: height }}
        locale={ {emptyText: 'No data acquired.' }}
        bordered
      />
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        topics: [],
      visible: false
    };
    this.handleGet();
  }

  handleGet = () => {
    fetch('/topics', {
        method: 'get'
      }).then(function(response) {
          if(response.ok) {
            return response.json();
        } else throw new Error('There was a problem with network connection.');
      }).then(function(json) {
          var newData = [];

          for(let i in json) {
            let d = new Date(json[i].created);

            newData.push({
            key: json[i].id,
            created: d.toUTCString(),
            title: json[i].title,
            description: json[i].Description,
            });

        }
        this.setState({
          topics: newData
        });
      }.bind(this));
  }

  handlePost = (postData) => {
    var d = new Date();

    fetch('/topics', {
      method: 'post',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({
        id: this.state.topics.length,
        title: postData.title,
        Description: postData.Description,
        created: d
      })
    }).then(function(response) {
        if(response.ok) {
          return response.json();
      } else throw new Error('There was a problem with network connection.');
    }).then(function(json) {
        let d = new Date(json.created);
        console.log('Data sent successfully! '+'ID: '+json.id+' Title: '+json.title+' Description: '+json.Description+ ' Created: '+d.toUTCString());
        this.handleGet();
    }.bind(this));
  }

  handlePut = (putData) => {
    var d = new Date();
    fetch('/topics/'+putData.id, {
      method: 'put',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({
        id: this.state.topics.length-1,
        title: putData.title,
        Description: putData.Description,
        created: d
      })
    }).then(function(response) {
        if(response.ok) {
          return response.json();
      } else throw new Error('There was a problem with network connection.');
    }).then(function(json) {
        let d = new Date(json.created);
        console.log('Data updated! '+'ID: '+json.id+' Title: '+json.title+' Description: '+json.Description+ ' Created: '+d.toUTCString());
        this.handleGet();
    }.bind(this));
  }

  handleDelete = (id) => {
    fetch('/topics/'+id, {
      method: 'delete'
    }).then(function(response) {
        if(response.ok) {
          this.handleGet();
        }
      else throw new Error('There was a problem with network connection.')
      }.bind(this));
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        console.log("An error occured when reading form data! "+err);
        return;
      }

      this.handlePost(values);
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  refForm = (form) => {
    this.form = form;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={titleimg} className="App-titleimg" alt="titleimg" />
          <p className="App-title">Thesis Portal</p>
        </div>
        <div className="App-body">
          <div className="App-body-table">
            <MainTable data={ this.state.topics } />
            <PostForm
              ref={this.refForm}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
            <Button type="primary" onClick={this.showModal}>Create a new thesis</Button>
            <Button type="primary" id="get" onClick={this.handleGet}>GET</Button>
            <Button type="primary" id="put" onClick={() => (this.handlePut(0, 0))}>PUT</Button>
            <Button type="primary" id="del" onClick={() => (this.handleDelete(0))}>DELETE</Button>
          </div>
        </div>
      </div>

    );
  }
}

export default App;