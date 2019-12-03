import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import {RouteComponentProps, Route, Switch, Link} from 'react-router-dom'
import uuid from 'uuid'

import { ApplicationState } from '../store'

import {LikeDto, Thread, ThreadComment} from "../store/threads/types";

import { add, init, like } from "../store/threads/actions";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    threads: Thread[],
    userName: string,
    loading: boolean,
    errors?: string
    userMessage: string
}

interface PropsFromDispatch {
    add: typeof add
    like: typeof like
    init: typeof init
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch

const ThreadsPage: React.FC<AllProps> = ({ match, add, init, like, userMessage, userName, loading, threads }) => {
    const [ text, setText ] = useState('');

    useEffect(() => {
        if (loading) {
            init();
        }
    });

    function handleAdd(text: string) {
        add({
            clientId: uuid(),
            timestamp: new Date(),
            author: userName,
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

    return (
        <div>
            <p>Threads{loading ? ' (loading...)' : ''}</p>

            {threads
                // .filter(thread => player.is_current_team_member === true)
                .map((thread, index) => (
                    <Link key={index} to={{
                        pathname: `/thread/${thread.serverId}`,
                        state: { threadServerId: thread.serverId }
                    }}>
                        <hr/>
                        <p>Likes: {thread.likedBy.length}</p>
                        <p>{(new Date(thread.timestamp)).toISOString()}</p>
                        <p>{thread.text}</p>
                        <p>by {thread.author}</p>
                        <button onClick={() => handleLike(thread)} disabled={thread.likedBy.indexOf(userName) !== -1}>Like</button>
                        <hr/>
                    </Link>
                ))
            }

            <p>Ask question</p>
            <input value={text} onChange={e => setText(e.target.value) } />
            <button onClick={e => handleAdd(text)} >Send</button>
        </div>
    )
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ threads, user }: ApplicationState) => ({
    userName: user.name,
    threads: threads.threads,
    loading: threads.loading,
    userMessage: threads.userMessage
})

const mapDispatchToProps = {
    add,
    init,
    like
};

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps, mapDispatchToProps)(ThreadsPage)