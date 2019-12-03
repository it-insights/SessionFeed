import { Store, createStore, applyMiddleware } from 'redux'
// @ts-ignore
import createSagaMiddleware from 'redux-saga'
// `react-router-redux` is deprecated, so we use `connected-react-router`.
// This provides a Redux middleware which connects to our `react-router` instance.
import { routerMiddleware } from 'connected-react-router'
// We'll be using Redux Devtools. We can use the `composeWithDevTools()`
// directive so we can pass our middleware along with it
// @ts-ignore
import { composeWithDevTools } from 'redux-devtools-extension'
// If you use react-router, don't forget to pass in your history type.
import { History } from 'history'

// Import the state interface and our combined reducers/sagas.
import { ApplicationState, createRootReducer, rootSaga } from './store'

import { socketSaga } from './store/socket'

export default function configureStore(history: History, initialState: ApplicationState): Store<ApplicationState> {
    // create the composing function for our middlewares
    const composeEnhancers = composeWithDevTools({});
    // create the redux-saga middleware
    const sagaMiddleware = createSagaMiddleware();
    const socketMiddleware = createSagaMiddleware();

    // We'll create our store with the combined reducers/sagas, and the initial Redux state that
    // we'll be passing from our entry point.
    const store = createStore(
        createRootReducer(history),
        initialState,
        composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware, socketMiddleware))
    );

    // Don't forget to run the root saga, and return the store object.
    sagaMiddleware.run(rootSaga);
    socketMiddleware.run(socketSaga);

    return store
}