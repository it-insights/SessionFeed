import React, {Component, useEffect} from 'react';
import {Route, Redirect, RouteComponentProps} from 'react-router-dom';
import { connect } from "react-redux"
import { ApplicationState } from "../store";
import { login } from "../store/user/actions";
import getRandomColor from "../utils/randomColor";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    isAuthenticated: boolean,
}

interface PropsFromDispatch {
    login: typeof login
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch & any

// @ts-ignore
const PrivateRoute: React.FC<AllProps> = ({ login, isAuthenticated, component: Component, ...params }) => {
    const user = localStorage.getItem('user');

    let avatarUrl = localStorage.getItem('avatarUrl');

    useEffect(() => {
        if (user && !isAuthenticated) {
            // For migration purposes...
            if (!avatarUrl)
                avatarUrl = `https://api.adorable.io/avatars/face/eyes${Math.floor(Math.random() * 10) + 1}/nose${Math.floor(Math.random() * 10) + 1}/mouth${Math.floor(Math.random() * 10) + 1}/${getRandomColor()}`

            login(user, avatarUrl);
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
    login
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)