import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider,BrowserRouter } from 'react-router-dom';
import router from './routes/Router';
import Router from './routes/Router'
import { Provider  } from 'react-redux';
import {store } from './store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      {/* <RouterProvider router={router}/> */}
      <BrowserRouter><Router/></BrowserRouter>
      
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();
