import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider, Client, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache';

const cache = cacheExchange({})

const client = new Client({
  url: 'http://192.168.0.150:5000/graphql',
  exchanges: [dedupExchange, cache, fetchExchange],
})

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
