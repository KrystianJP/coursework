import React, { Component } from "react";
import axios from "axios";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
      selectedProject: { id: "0", name: "All tasks" },
      projectInput: false,
      projectInputValue: "All tasks",
      confirmMsg: false,
      tasks: [],
      modalTask: "",
      taskModal: false,
    };
    this.listiliseProjects = this.listiliseProjects.bind(this);
    this.listiliseTasks = this.listiliseTasks.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.nameOrInput = this.nameOrInput.bind(this);
    this.submitProjectName = this.submitProjectName.bind(this);
    this.projectConfirmMessage = this.projectConfirmMessage.bind(this);
    this.submitDeletion = this.submitDeletion.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.taskModal = this.taskModal.bind(this);
  }

  componentDidMount() {
    this.getProjects();
    this.reactivateTasks();
  }

  getProjects() {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    axios
      .get("/api/projects", config)
      .then((response) => {
        this.setState({ projects: response.data.projects, confirmMsg: false });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  taskModal(task) {
    return (
      <div
        class="dark-bg"
        onClick={() => {
          this.setState({ taskModal: false });
        }}
      >
        <div class="task-modal">
          <h1>{task.name}</h1>
          <div class="task-view-group">
            <h2>Description</h2>
            <p class="task-desc">
              {task.description ? task.description : "<No description>"}
            </p>
          </div>
          <div class="task-view-group">
            <h2>Due Date</h2>
            <p>{task.date_formatted ? task.date_formatted : "<No due date>"}</p>
          </div>
          <div class="task-view-group">
            <p>{task.repeat ? "Repeats? Yes" : "Repeats? No"}</p>
          </div>
          <button>Close</button>
        </div>
      </div>
    );
  }

  listiliseProjects(projects) {
    let sortedProjects = projects.sort((a, b) => a.name.localeCompare(b.name));
    return sortedProjects.map((project) => (
      <li
        className={
          this.state.selectedProject.id === project._id
            ? "project selected"
            : "project"
        }
        key={project._id}
        onClick={() => {
          this.selectProject(project._id, project.name);
        }}
      >
        {project.name ? project.name : "<untitled>"}
      </li>
    ));
  }

  listiliseTasks(tasks) {
    return tasks.map((task) => (
      <li
        className="task"
        onClick={() => {
          this.setState({ modalTask: task, taskModal: true });
        }}
        key={task._id}
      >
        <div className="task-left">
          <span className="task-name">{task.name}</span>
        </div>
        <div className="task-right">
          <span
            className={
              !task.dueDate
                ? "due-date"
                : new Date(task.dueDate).setHours(0, 0, 0, 0) ==
                  new Date().setHours(0, 0, 0, 0)
                ? "due-date orange-text"
                : new Date(task.dueDate) < new Date()
                ? "due-date red-text"
                : "due-date"
            }
          >
            {task.date_formatted}
          </span>
          <span
            className={
              task.repeat
                ? "material-symbols-outlined repeat-icon"
                : "material-symbols-outlined repeat-icon faded"
            }
          >
            cycle
          </span>
          <a
            className="material-symbols-outlined edit-icon"
            href={"/task/edit/" + task._id}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            edit
          </a>

          <span
            className="material-symbols-outlined complete-icon"
            onClick={(e) => {
              e.stopPropagation();
              this.completeTask(task.repeat, task._id);
            }}
          >
            check
          </span>
        </div>
      </li>
    ));
  }

  reactivateTasks() {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    axios
      .get("/api/tasks/reactivate", config)
      .then(() => {
        this.getTasks();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  selectProject(id, name) {
    this.setState(
      {
        selectedProject: { id, name },
        projectInputValue: name,
        projectInput: false,
        confirmMsg: false,
        tasks: [],
      },
      () => {
        this.getTasks();
      },
    );
  }

  completeTask(repeat, id) {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    if (repeat) {
      axios
        .get("/api/task/deactivate/" + id, config)
        .then(() => {
          this.getTasks();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .get("/api/task/delete/" + id, config)
        .then(() => {
          this.getTasks();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  getTasks() {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    axios
      .get("/api/tasks/" + this.state.selectedProject.id, config)
      .then((response) => {
        this.setState({ tasks: response.data.tasks });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  projectConfirmMessage(condition) {
    if (condition) {
      return (
        <form className="confirm-form" onSubmit={this.submitDeletion}>
          <span className="confirm-msg">Delete this project?</span>
          <button
            className="material-symbols-outlined confirm-button"
            type="submit"
          >
            check
          </button>
          <button
            className="material-symbols-outlined confirm-button"
            type="button"
            onClick={() => {
              this.setState({ confirmMsg: false });
            }}
          >
            close
          </button>
        </form>
      );
    } else {
      return "";
    }
  }

  submitDeletion(e) {
    e.preventDefault();
    let body = {
      id: this.state.selectedProject.id,
    };
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    axios
      .post("/api/project/delete", body, config)
      .then(() => {
        this.setState({
          selectedProject: {
            id: "0",
            name: "All tasks",
          },
          projectInput: false,
        });
        this.getProjects();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  nameOrInput(condition) {
    if (condition && !(this.state.selectedProject.id === "0")) {
      return (
        <form className="project-name-form" onSubmit={this.submitProjectName}>
          <input
            name="projectname"
            id="projectname"
            autoFocus
            type="text"
            className="project-name-input"
            value={this.state.projectInputValue}
            onChange={(e) => {
              this.setState({ projectInputValue: e.target.value });
            }}
          ></input>
          <button className="login" type="submit">
            <span className="material-symbols-outlined edit-icon">check</span>
          </button>
        </form>
      );
    } else {
      return (
        <h2 className="project-name">
          {this.state.selectedProject.name}
          {this.state.selectedProject.id !== "0" ? (
            <div>
              <span
                className="material-symbols-outlined edit-icon"
                onClick={() => {
                  this.setState({ projectInput: true });
                }}
              >
                edit
              </span>
              <span
                className="material-symbols-outlined edit-icon"
                onClick={() => {
                  this.setState({ confirmMsg: !this.state.confirmMsg });
                }}
              >
                delete
              </span>
            </div>
          ) : (
            ""
          )}
        </h2>
      );
    }
  }

  submitProjectName(e) {
    e.preventDefault();
    let body = {
      projectname: this.state.projectInputValue,
      id: this.state.selectedProject.id,
    };
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    axios
      .post("/api/project/edit", body, config)
      .then((response) => {
        this.getProjects();
        this.setState({
          selectedProject: {
            id: response.data.project.id,
            name: response.data.project.name,
          },
          projectInput: false,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <div className="home">
        {this.state.taskModal ? this.taskModal(this.state.modalTask) : ""}
        <aside className="sidebar">
          <div className="default-projects-container">
            <ul className="default-projects">
              <li
                className={
                  this.state.selectedProject.id === "0"
                    ? "project selected"
                    : "project"
                }
                onClick={() => {
                  this.selectProject("0", "All tasks");
                }}
              >
                <span className="material-symbols-outlined">list</span>All tasks
              </li>
            </ul>
          </div>
          <div className="projects-container">
            <h2>
              Projects{" "}
              <a href="/project/add" className="material-symbols-outlined">
                add
              </a>
            </h2>
            <ul className="projects">
              {this.listiliseProjects(this.state.projects)}
            </ul>
          </div>
        </aside>
        <div className="tasks-container">
          {this.nameOrInput(this.state.projectInput)}
          {this.projectConfirmMessage(this.state.confirmMsg)}
          <div className="tasks">
            <a
              href={"/task/add/" + this.state.selectedProject.id}
              className="task-add"
            >
              Add task
              <span className="material-symbols-outlined">add</span>
            </a>
            <ul className="task-list">
              {this.listiliseTasks(this.state.tasks)}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
