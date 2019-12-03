import React, {Component, useEffect} from 'react';
import {Route, Redirect, RouteComponentProps} from 'react-router-dom';
import { connect } from "react-redux"
import { ApplicationState } from "../store";
import { setName, login } from "../store/user/actions";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    isAuthenticated: boolean,
}

interface PropsFromDispatch {
    setName: typeof setName
    login: typeof login
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch & any

// @ts-ignore
const PrivateRoute: React.FC<AllProps> = ({ setName, login, isAuthenticated, component: Component, ...params }) => {
    const user = localStorage.getItem('user');

    useEffect(() => {
        if (user && !isAuthenticated) {
            setName(user);
            login(user);
        }
    })

    return (
        <Route {...params} render={props => (
            user ? <Component {...props} />
                 : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
        )}/>
    )
}

const mapStateToProps = ({ user }: ApplicationState) => ({
    isAuthenticated: user.isAuthenticated
})

const mapDispatchToProps = {
    setName,
    login
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)