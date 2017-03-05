import React, { Component } from 'react';
import { Button, Table, Form, Input, InputNumber, Modal } from 'antd';
import titleimg from './titleimg.png'; //source: http://www.clker.com/cliparts/a/1/3/8/11949859511240324938open_book_nae_02.svg.hi.png
import './App.css';

const FormItem = Form.Item;

/**
 * Generates table header data.
 */
const cols = [{
  title: 'ID',
  dataIndex: 'key',
  key: 'key',
  width: 40,
}, {
  title: 'Last change',
  dataIndex: 'created',
  key: 'created',
  width: 200,
}, {
  title: 'Title',
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

/**
 * Generates a new MainTable used to show all acquired data.
 * @return the desired table with set parameters.
 */
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

/**
 * Generates the design of a posting form.
 * @param visible  true if form is visible, false otherwise.
 * @param onCancel function to call when Cancel is pressed.
 * @param onCreate function to call when Create is pressed.
 * @param form     reference form.
 * @return         the desired PostForm embedded into a Modal.
 */
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

/**
 * Generates the design of a putting form.
 * @param visible  true if form is visible, false otherwise.
 * @param onCancel function to call when Cancel is pressed.
 * @param onCreate function to call when Create is pressed.
 * @param form     reference form.
 * @return         the desired PutForm embedded into a Modal.
 */
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

/**
 * Generates the design of the main application.
 */
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

  /**
   * Connects to the server to update current data using GET. Updates main table accordingly.
   */
  handleGet = () => {
    fetch('/topics', {
        method: 'get'
      }).then(function(response) {
          if(response.ok) {
            return response.json();
        } else throw new Error('There was a problem with network connection.');
      }).then(function(json) {
          var newData = [];
          var ids = [];

          for(let i in json) {
            if(json[i] !== null && json[i] !== "") {
              if(ids.indexOf(json[i].id) === -1) {
                let actions = <table>
                                <tbody>
                                  <tr>
                                    <td><Button type="primary" className="Put" onClick={() => { this.showPut(i, json[i].title, json[i].Description) } }>Update</Button></td>
                                    <td><Button type="danger" className="Delele" onClick={() => { this.handleDelete(i) } }>Delete</Button></td>
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
                ids.push(json[i].id);
            }
            else console.log("Found a duplicated ID key value: "+json[i].id+"! This thesis topic will be omitted!");
          }
          else throw new Error("Received data couldn't be read!");
        }
        this.setState({
          topics: newData
        });
      }.bind(this));
  }

  /**
   * Sends new thesis data to the server using POST. Updates main table accordingly.
   * @param postData data to be sent to the server.
   */
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
        if(json !== null && json !== "") this.handleGet();
        else throw new Error("Received data couldn't be read!");
    }.bind(this));
  }

  /**
   * Updates selected thesis data on the server using PUT. Updates main table accordingly.
   * @param putData data to be sent to the server.
   */
  handlePut = (putData) => {
    var d = new Date();
    fetch('/topics/'+putData.id, {
      method: 'put',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({
        id: putData.id,
        title: putData.title,
        Description: putData.Description,
        created: d
      })
    }).then(function(response) {
        if(response.ok) {
          return response.json();
      } else throw new Error('There was a problem with network connection.');
    }).then(function(json) {
        if(json !== null && json !== "") this.handleGet();
        else throw new Error("Received data couldn't be read!");
    }.bind(this));
  }

  /**
   * Deleted desired thesis data from the server using DELETE. Updates main table accordingly.
   * @param id id of the selected thesis.
   */
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

  /**
   * Makes PostForm visible.
   */
  showPost = () => {
    this.setState({ visiblePost: true });
  }

  /**
   * Makes PutForm visible with data from the desired thesis.
   * @param id    the id to be shown defaultly in the PutForm.
   * @param title the title to be shown defaultly in the PutForm.
   * @param desc  the description to be shown defaultly in the PutForm.
   */
  showPut = (id, title, desc) => {
    this.formPut.setFieldsValue({
      id: id,
      title: title,
      Description: desc
    });
    this.setState({ visiblePut: true, updateID: id });
  }

  /**
   * Makes both PostForm and PutForm close when desired, removing the content inside.
   */
  handleCancel = () => {
    this.setState({ visiblePost: false, visiblePut: false });
    this.formPost.resetFields();
    this.formPut.resetFields();
  }

  /**
   * Reads the data given by PostForm after pressing Create. Then tranfers the data to handlePost() and resets the values inside while hiding the PostForm.
   */
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

  /**
   * Reads the data given by PutForm after pressing Update. Then tranfers the data to handlePut() and resets the values inside while hiding the PutForm.
   */
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

  /**
   * Creates a reference form for PostForm.
   * @param form the desired form.
   */
  refFormPost = (form) => {
    this.formPost = form;
  }

  /**
   * Creates a reference form for PutForm.
   * @param form the desired form.
   */
  refFormPut = (form) => {
    this.formPut = form;
  }

  /**
   * Renders the whole application.
   * @return the desired HTML code.
   */
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={ titleimg } className="App-titleimg" alt="titleimg" />
          <p className="App-title">Thesis Portal</p>
        </div>
        <div className="App-body">
          <div className="App-body-table">
            <MainTable data={ this.state.topics } /><br />
            <PostForm
              ref={this.refFormPost }
              visible={ this.state.visiblePost }
              onCancel={ this.handleCancel }
              onCreate={ this.handleCreate }
            />
            <PutForm
              ref={ this.refFormPut }
              visible={ this.state.visiblePut }
              onCancel={ this.handleCancel }
              onCreate={ this.handleUpdate }
              maxID={ this.state.topics.length-1 }
            />
            <Button className="Post" type="primary" onClick={ this.showPost }>Create a new thesis</Button>
          </div>
        </div>
      </div>

    );
  }
}

export default App;