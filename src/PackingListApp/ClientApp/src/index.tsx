/// <reference path="modules.d.ts" />
import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './app';
import './assets/theme.less';
import './assets/custom.scss';
import './assets/reports.scss';
import { initialize as initializeInversify, container } from './inversify.config';
import './utils/linq';
import { Provider as ReduxProvider } from 'react-redux';
import { ApplicationState } from './stores/reducers';
import configureStore from './configureStore';
import Titlebar from 'react-electron-titlebar';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl as string });
const rootElement = document.getElementById('root');

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(history, initialState);
(window as any).store = store;

initializeInversify(undefined);

ReactDOM.render(
    <BrowserRouter basename={baseUrl as string}>
        <ReduxProvider store={store}>
            <React.Fragment>
               
                <App />
            </React.Fragment>
        </ReduxProvider>
    </BrowserRouter>,
  rootElement);