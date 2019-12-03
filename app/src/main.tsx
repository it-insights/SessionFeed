import * as React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Store } from 'redux'
// @ts-ignore
import { History } from 'history'

import Routes from './routes'
import { ApplicationState } from './store'

// Any additional component props go here.
interface MainProps {
    store: Store<ApplicationState>
    history: History
}

// Create an intersection type of the component props and our Redux props.
const Main: React.FC<MainProps> = ({ store, history }) => {
    return (
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <Routes />
            </ConnectedRouter>
        </Provider>
    )
}

// Normally you wouldn't need any generics here (since types infer from the passed functions).
// But since we pass some props from the `index.js` file, we have to include them.
// For an example of a `connect` function without generics, see `./containers/LayoutContainer`.
export default Main