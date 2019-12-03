import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router'

import { ApplicationState } from '../store'
import { User } from '../store/user/types'
import { login } from "../store/user/actions";
import {useState} from "react";
import getRandomColor from "../utils/randomColor";
import {Button, Form, Grid, Segment, Divider, Header} from "semantic-ui-react";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    loading: boolean
    name: string
    errors?: string
    isAuthenticated: boolean
}

interface PropsFromDispatch {
    login: typeof login
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch

const LoginPage: React.FC<AllProps> = ({ match, login, isAuthenticated, history }) => {
    const [ name, setName ] = useState('');

    if (isAuthenticated)
        history.push('/');

    function handleLogin(name: string) {
        const avatarUrl = `https://api.adorable.io/avatars/face/eyes${Math.floor(Math.random() * 10) + 1}/nose${Math.floor(Math.random() * 10) + 1}/mouth${Math.floor(Math.random() * 10) + 1}/${getRandomColor()}`

        login(name, avatarUrl);
    }

    return (
        <div>
            <Grid centered columns={3}>
                <Grid.Column>
                    <Grid.Row>
                        <Segment>
                            <Form>
                                <Form.Field>
                                    <input placeholder='What is your name?' value={name} onChange={e => setName(e.target.value) }/>
                                </Form.Field>
                                <Button id='login' type='submit' onClick={e => handleLogin(name)}>Join</Button>
                            </Form>
                        </Segment>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
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
    login
};

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage))