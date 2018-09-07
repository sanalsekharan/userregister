import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';



import thunk from 'redux-thunk';
// import { Route } from 'react-router'
import reducer from './reducer';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import './App.css';

const reducers = combineReducers({
    reducer
});



const store = createStore(
    reducers,
    applyMiddleware(thunk)
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
