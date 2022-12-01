import React, { Component } from "react";
import axios from "axios";

class Test extends Component {
  constructor() {
    super();
    this.state = { value: "" };
  }

  componentDidMount() {
    axios
      .get("/api/test")
      .then((response) => {
        this.setState({ value: response.data.message });
        return;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return <div>{this.state.value}</div>;
  }
}

export default Test;
