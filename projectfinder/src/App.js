import React, { Component } from 'react';
import axios from './axios';
import './App.css';



export default class App extends Component {
  idRef = React.createRef();
  state = {
    projects: []
  }

  fetchPost = (event, id) => {
    event.preventDefault();
    axios.get(`/projects/${id}`)
      .then(res => {
        this.setState({ projects: this.state.projects.concat(res.data) })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div className="App" >
        <h1>Project Finder</h1>
        <div>
          <form onSubmit={event => this.fetchPost(event, this.idRef.current.value)}>
            <input required type="number" min="1" placeholder="enter project id" ref={this.idRef} />
            <input type="submit" />
          </form>
        </div>
        {
          this.state.projects.map(project =>
            <div key={project.id}>
              <h2>{project.name}</h2>
              <h3>{project.description}</h3>
              <h4>Actions</h4>
              {
                project.actions.map(action =>
                  <div key={action.id}>
                    <p>{action.notes}</p>
                    <p>Description:<span> {action.description}</span></p>
                  </div>
                )
              }
            </div>
          )
        }

      </div>
    )
  };
}

