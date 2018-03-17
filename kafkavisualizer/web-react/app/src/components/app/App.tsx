import * as React from 'react';
import './App.css';
import TopicList from '../topics/TopicList';
import BrokerList from '../brokers/BrokerList';
import TopicMessages  from '../topics/TopicMessage';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 sidebar">
            <BrokerList />
            <TopicList />
          </div>
          <div className="col-9 ml-auto" >
            <TopicMessages />            
          </div>
        </div>
      </div>
    );
  }
}

export default App;
