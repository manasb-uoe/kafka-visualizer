import * as React from 'react';
import './App.css';
import TopicList from '../topics/TopicList';
import BrokerList from '../brokers/BrokerList';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 sidebar">
            <BrokerList />
            <TopicList />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
