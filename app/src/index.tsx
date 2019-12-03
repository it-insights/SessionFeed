import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import Main from './main';
import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore'
import {ApplicationState} from "./store";

import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

const store = configureStore(history, {} as ApplicationState)

ReactDOM.render(<Main store={store} history={history} />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
