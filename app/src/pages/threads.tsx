import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import {RouteComponentProps, Route, Switch, Link} from 'react-router-dom'
import uuid from 'uuid'
// @ts-ignore
import TimeAgo from 'react-timeago'

import { ApplicationState } from '../store'

import {LikeDto, Thread, ThreadComment} from "../store/threads/types";

import { add, like } from "../store/threads/actions";
import {Button, Feed, Form, Header, Icon, TextArea, Image, Loader} from "semantic-ui-react";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    threads: Thread[],
    userName: string,
    avatarUrl: string,
    loading: boolean,
    errors?: string
    userMessage: string
}

interface PropsFromDispatch {
    add: typeof add
    like: typeof like
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch

const ThreadsPage: React.FC<AllProps> = ({ match, add, like, avatarUrl, userName, loading, threads }) => {
    const [ text, setText ] = useState('');

    function handleAdd(text: string) {
        add({
            clientId: uuid(),
            timestamp: new Date(),
            author: {
                name: userName,
                avatarUrl: avatarUrl
            },
            text,
            likedBy: [] as string[],
            comments: [] as ThreadComment[]
        } as Thread)

        setText('');
    }

    function handleLike(thread: Thread) {
        like({
            serverId: thread.serverId,
            user: userName
        } as LikeDto)
    }



    const Thread = (thread: Thread, index: number) => (
        <Feed.Event key={index}>
            <Feed.Label>
                <img style={{ opacity: 0.8 }} src={thread.author.avatarUrl} />
            </Feed.Label>
            <Feed.Content>
                <Feed.User>
                    {thread.author.name}
                </Feed.User>
                &nbsp;
                posted a question.
                &nbsp;
                <Feed.Extra text>
                    {thread.text}
                </Feed.Extra>
                <Feed.Meta style={{ width: '500px'}}>
                    <Feed.Date style={{ display: 'inline' }}><TimeAgo date={thread.timestamp} /></Feed.Date>
                    <Feed.Like onClick={() => handleLike(thread)}>
                        <Icon style={{ color: (thread.likedBy.indexOf(userName) === -1 ? 'inherit' : '#ff2733') }} name='like' />{thread.likedBy.length} Like{ thread.likedBy.length == 1 ? '' : 's'}
                    </Feed.Like>
                    <Link to={{
                        pathname: `/thread/${thread.serverId}`,
                        state: { threadServerId: thread.serverId }
                    }}>
                        <Feed.Like as='span'>
                            <Icon  name='comment' />{thread.comments.length} Comment{ thread.comments.length == 1 ? '' : 's'}
                        </Feed.Like>
                    </Link>
                </Feed.Meta>
            </Feed.Content>
        </Feed.Event>
    )

    return (
        <div>
            <Header as='h2' icon textAlign='center'>
                { loading ? <Loader active inline /> : <Icon name='question' circular /> }
                <Header.Content>Threads</Header.Content>
            </Header>
            <Feed size='large'>
                {threads
                    .map((thread, index) => (
                        Thread(thread, index)
                    ))
                }
            </Feed>
            <Form>
                <TextArea placeholder='Ask a question...' value={text} onChange={(e, data) => setText(data.value as string) } />
                <Button type='submit'  onClick={e => handleAdd(text)}>Submit</Button>
            </Form>
        </div>
    )
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ threads, user }: ApplicationState) => ({
    userName: user.name,
    avatarUrl: user.avatarUrl,
    threads: threads.threads,
    loading: threads.loading,
    userMessage: threads.userMessage
})

const mapDispatchToProps = {
    add,
    like
};

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps, mapDispatchToProps)(ThreadsPage)