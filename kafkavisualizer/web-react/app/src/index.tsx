import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import configureStore from './store/configureStore';
import { loadAllTopics } from './actions/topicActions';

const store = configureStore();
store.dispatch(loadAllTopics());

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
