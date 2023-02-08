import React, { Component } from "react";
import axios from "axios";

class ProjectAdd extends Component {
  constructor() {
    super();
    this.state = { name: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let body = { name: this.state.name };
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    axios
      .post("/api/project/add", body, config)
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
          <h1>Add Project</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Project name:</label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => {
                  this.setState({ name: e.target.value });
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

export default ProjectAdd;
