import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'

import { ApplicationState } from '../store'
import { User } from '../store/user/types'
import { login, setName } from "../store/user/actions";
import {useState} from "react";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    loading: boolean
    name: string
    errors?: string
    isAuthenticated: boolean
}

interface PropsFromDispatch {
    login: typeof login
    setName: typeof setName
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch

const LoginPage: React.FC<AllProps> = ({ match, name, setName, login, isAuthenticated, history }) => {
    if (isAuthenticated)
        history.push('/');

    return (
        <div>
            <p>Login Name</p>
            <input value={name} onChange={e => setName(e.target.value) } />
            <button onClick={e => login(name)} >Login</button>
        </div>
    )
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ router, user }: ApplicationState) => ({
    loading: user.loading,
    errors: user.errors,
    name: user.name,
    isAuthenticated: user.isAuthenticated
})

const mapDispatchToProps = {
    login,
    setName
};

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage))