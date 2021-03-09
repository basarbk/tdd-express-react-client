import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap-override.scss';
import * as serviceWorker from './serviceWorker';
import App from './container/App';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import './i18n';

const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </Provider>,
  document.getElementById('root')
);





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
