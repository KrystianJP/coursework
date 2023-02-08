import React, { Component } from "react";
import axios from "axios";

class TaskAdd extends Component {
  constructor() {
    super();
    this.state = { name: "", description: "", dueDate: "", repeat: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
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
        console.error(error);
      });
  }

  cancel() {
    window.location.href = "/";
  }

  render() {
    return (
      <div className="page-container">
        <div className="page">
          <h1>Add Task</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
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

export default TaskAdd;
