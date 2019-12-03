

import React, {Component, useEffect, useState} from 'react';
import {Route, Redirect, RouteComponentProps} from 'react-router-dom';
import { connect } from "react-redux"
import { ApplicationState } from "../store";
import { login } from "../store/user/actions";
import getRandomColor from "../utils/randomColor";
import { withRouter } from 'react-router'
import {Menu} from "semantic-ui-react";

// Separate state props + dispatch props to their own interfaces.
// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = RouteComponentProps

// @ts-ignore
const Header: React.FC<AllProps> = ({ history }) => {
    const [ activeItem, setActiveItem ] = useState('Threads')

    return (
        <Menu pointing secondary>
            <Menu.Item
                name='Threads'
                active={activeItem === 'Threads'}
                onClick={() => {
                    setActiveItem('Threads');
                    history.push('/')
                }}
            />
            <Menu.Item
                name='Vote'
                active={activeItem === 'Vote'}
                onClick={() => {
                    setActiveItem('Vote');
                    history.push('/vote')
                }}
            />
        </Menu>
    )
}

export default withRouter(connect()(Header))