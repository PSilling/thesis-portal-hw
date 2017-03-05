import React, { Component } from 'react';
import { Button, Table, Form, Input, InputNumber, Modal } from 'antd';
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
  key: 'description'
}, {
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
  width: 170,
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

const PutForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, maxID } = props;
    const { getFieldDecorator } = form;
    const width = window.innerWidth - 300;

    return (
      <Modal
        visible={visible}
        title="Update thesis"
        okText="Update"
        cancelText="Cancel"
        width={width}
        onOk={onCreate}
        onCancel={onCancel}
      >
        <Form vertical>
          <FormItem label="Thesis ID">
            {getFieldDecorator('id', {
              rules: [{ required: true, message: 'Thesis ID is required!' }]
            })(
              <InputNumber min={0} max={maxID} />
            )}
          </FormItem>
          <FormItem label="New title">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Thesis title is required!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="New description">
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
    const height = window.innerHeight - 325;
    return <Table
        className="Table"
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
      visiblePost: false,
      visiblePut: false,
      updateID: 0
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
            let actions = <table>
                            <tbody>
                              <tr>
                                <td><Button type="primary" className="put" onClick={() => { this.showPut(i) } }>Update</Button></td>
                                <td><Button type="danger" className="delele" onClick={() => { this.handleDelete(i) } }>Delete</Button></td>
                              </tr>
                            </tbody>
                          </table>

            let d = new Date(json[i].created);

            newData.push({
            key: json[i].id,
            created: d.toUTCString(),
            title: json[i].title,
            description: json[i].Description,
            action: actions,
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
        console.log('Data sent successfully! ID: '+json.id+' Title: '+json.title+' Description: '+json.Description+ ' Created: '+d.toUTCString());
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
        console.log('Data updated! ID: '+json.id+' Title: '+json.title+' Description: '+json.Description+ ' Created: '+d.toUTCString());
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

  showPost = () => {
    this.setState({ visiblePost: true });
  }

  showPut = (id) => {
    this.formPut.setFieldsValue({
      id: id,
    });
    this.setState({ visiblePut: true, updateID: id });
  }

  handleCancel = () => {
    this.setState({ visiblePost: false, visiblePut: false });
  }

  handleCreate = () => {
    const form = this.formPost;
    form.validateFields((err, values) => {
      if (err) {
        console.log("An error occured when reading form data! "+err);
        return;
      }

      this.handlePost(values);
      form.resetFields();
      this.setState({ visiblePost: false });
    });
  }

  handleUpdate = () => {
    const form = this.formPut;
    form.validateFields((err, values) => {
      if (err) {
        console.log("An error occured when reading form data! "+err);
        return;
      }

      this.handlePut(values);
      form.resetFields();
      this.setState({ visiblePut: false });
    });
  }

  refFormPost = (form) => {
    this.formPost = form;
  }

  refFormPut = (form) => {
    this.formPut = form;
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
            <MainTable data={ this.state.topics } /><br />
            <PostForm
              ref={this.refFormPost}
              visible={this.state.visiblePost}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
            <PutForm
              ref={this.refFormPut}
              visible={this.state.visiblePut}
              onCancel={this.handleCancel}
              onCreate={this.handleUpdate}
              maxID={ this.state.topics.length-1 }
            />
            <Button className="Post" type="primary" onClick={this.showPost}>Create a new thesis</Button>
          </div>
        </div>
      </div>

    );
  }
}

export default App;