import * as React from 'react';
import './App.css';
import TopicList from '../topics/TopicList';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 sidebar">
            <TopicList />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
