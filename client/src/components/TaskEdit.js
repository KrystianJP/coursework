import React, { Component } from "react";
import axios from "axios";

class TaskEdit extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      description: "",
      dueDate: "",
      repeat: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let body = {
      name: this.state.name,
      description: this.state.description,
      dueDate: this.state.dueDate,
      repeat: this.state.repeat,
    };
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    axios
      .post("/api" + window.location.pathname, body, config)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }

  componentDidMount() {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    axios
      .get("/api/task/" + window.location.pathname.split("/")[3], config)
      .then((response) => {
        let task = response.data.task;
        let dueDate;
        if (!task.dueDate) {
          dueDate = "";
        } else {
          // setting to yyyy-mm-dd format for HTML to recognise
          dueDate = new Date(task.dueDate);
          let mm = dueDate.getMonth() + 1;
          let dd = dueDate.getDate();

          dueDate = [
            dueDate.getFullYear(),
            (mm > 9 ? "" : "0") + mm,
            (dd > 9 ? "" : "0") + dd,
          ].join("-");
        }
        this.setState({
          name: task.name,
          description: task.description,
          dueDate,
          repeat: task.repeat,
        });
        return;
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }

  deleteTask() {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    console.log(window.location.pathname.split("/"));
    axios
      .get("/api/task/delete/" + window.location.pathname.split("/")[3], config)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }

  cancel() {
    window.location.href = "/";
  }

  render() {
    return (
      <div className="page-container">
        <div className="page">
          <h1>Edit Task</h1>
          <div className="input-group">
            <button
              className="material-symbols-outlined delete-btn"
              onClick={() => {
                this.deleteTask();
              }}
            >
              Delete
            </button>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={this.state.name}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              ></input>
            </div>
            <div className="input-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={this.state.description}
                onChange={(e) => {
                  this.setState({ description: e.target.value });
                }}
              ></textarea>
            </div>
            <div className="input-group">
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={this.state.dueDate}
                onChange={(e) => {
                  this.setState({ dueDate: e.target.value });
                }}
              ></input>
            </div>
            <div className="input-group-checkbox">
              <label htmlFor="repeat">Repeat?</label>
              <input
                type="checkbox"
                id="repeat"
                name="repeat"
                checked={this.state.repeat}
                onChange={(e) => {
                  this.setState({ repeat: e.target.checked });
                }}
              ></input>
            </div>

            <button className="submit-btn" type="submit">
              Submit
            </button>
            <button className="delete-btn" type="button" onClick={this.cancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default TaskEdit;
