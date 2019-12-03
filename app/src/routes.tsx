import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import Header from './components/Header'
import LoginPage from './pages/login'
import ThreadsPage from './pages/threads'
import ThreadPage from './pages/thread'
import PrivateRoute from "./components/PrivateRoute";

const Routes: React.FC = () => (
    <div>
        <Header title="Session Feed" />
        <Switch>
            <PrivateRoute exact path="/" component={ThreadsPage} />
            <PrivateRoute path="/thread/:id" component={ThreadPage} />
            <Route path="/login" component={LoginPage} />
            <Route component={() => <div>Not Found</div>} />
        </Switch>
    </div>
)

export default Routes