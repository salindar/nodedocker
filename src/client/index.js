/*
Salinda Rathnayeka
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import AppRoutes from './route';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
         <AppRoutes />
    </Provider>,
    document.getElementById('root')
)