import React, { Component } from "react";

class Home extends Component {
  render() {
    return (
      <div className="home">
        <aside className="sidebar">
          <div className="default-projects-container">
            <ul className="default-projects">
              <li className="project">
                <span className="material-symbols-outlined">list</span>All tasks
              </li>
            </ul>
          </div>
          <div className="projects-container">
            <h2>Projects</h2>
            <ul className="projects">
              <li className="project">Example project</li>
            </ul>
          </div>
        </aside>
        <div className="tasks-container">
          <h2 className="project-name">
            Example Project{" "}
            <span className="material-symbols-outlined edit-icon">edit</span>
          </h2>
          <div className="tasks">
            <ul className="task-list">
              <li className="task">
                <div className="task-left">
                  <span className="task-name">Example task</span>
                </div>
                <div className="task-right">
                  <span className="material-symbols-outlined repeat-icon">
                    cycle
                  </span>
                  <span className="material-symbols-outlined edit-icon">
                    edit
                  </span>
                  <span className="material-symbols-outlined complete-icon">
                    check
                  </span>
                  <span className="due-date">10/12/22</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
