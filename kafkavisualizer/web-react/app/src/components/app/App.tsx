import * as React from 'react';
import './App.css';
import TopicList from '../topics/TopicList';
import BrokerList from '../brokers/BrokerList';
import TopicMessages from '../topics/TopicMessage';
import { Tabs, Tab } from '../tabs/Tabs';
import TopicConsumers from '../topics/TopicConsumers';

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
            <Tabs>
              <Tab title="Messages">
                <TopicMessages />
              </Tab>
              <Tab title="Consumers">
                <TopicConsumers />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
