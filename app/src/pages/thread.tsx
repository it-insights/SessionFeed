import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import {RouteComponentProps, Route, Switch, Link} from 'react-router-dom'
import { ApplicationState } from '../store'
import {LikeDto, Thread, ThreadComment} from "../store/threads/types";
import { addComment, like } from "../store/threads/actions";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    loading: boolean,
    threads: Thread[],
    userName: string,
    userAvatarUrl: string,
    errors?: string
}

interface PropsFromDispatch {
    addComment: typeof addComment
    like: typeof like
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch

const ThreadPage: React.FC<AllProps> = ({ match, location,userAvatarUrl, like, addComment, threads, userName }) => {
    const [ text, setText ] = useState('');

    const thread = threads.find(t => t.serverId === location.pathname.split('/').pop()) as Thread;

    if (!thread)
        return (
            <div>
                Thread not found.
            </div>
        );

    function handleAddComment(text: string) {
        addComment(thread.serverId, {
            timestamp: new Date(),
            author: {
                name: userName,
                avatarUrl: userAvatarUrl
            },
            text
        } as ThreadComment)

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
            <p>Likes: {thread.likedBy.length}</p>
            <p>{(new Date(thread.timestamp)).toISOString()}</p>
            <p>{thread.text}</p>
            <p>by {thread.author.name}</p>
            <button onClick={() => handleLike(thread)} disabled={thread.likedBy.indexOf(userName) !== -1}>Like</button>

            {thread.comments
                // .filter(thread => player.is_current_team_member === true)
                .map((comment, index) => (
                    <div key={index}>
                        <hr/>
                        <p>Comment at {(new Date(comment.timestamp)).toISOString()}</p>
                        <p>{comment.text}</p>
                        <p>by {comment.author.name}</p>
                        <hr/>
                    </div>
                ))
            }

            <p>Post comment</p>
            <input value={text} onChange={e => setText(e.target.value) } />
            <button onClick={e => handleAddComment(text)} >Send</button>
        </div>
    )
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ router, threads, user }: ApplicationState) => ({
    threads: threads.threads,
    userName: user.name,
    userAvatarUrl: user.avatarUrl,
    location: router.location,
    loading: threads.loading
})

const mapDispatchToProps = {
    addComment,
    like
};

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(mapStateToProps, mapDispatchToProps)(ThreadPage)