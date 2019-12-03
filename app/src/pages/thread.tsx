import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import {RouteComponentProps, Route, Switch, Link} from 'react-router-dom'
import { ApplicationState } from '../store'
import {LikeDto, Thread, ThreadComment} from "../store/threads/types";
import { addComment, like } from "../store/threads/actions";
import {Feed, Icon, Comment, Form, TextArea, Button, Item, Container, Segment} from "semantic-ui-react";
import TimeAgo from "react-timeago";
import {User} from "../store/user/types";

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

    const thread = threads.find(t => t.id === location.pathname.split('/').pop()) as Thread;

    if (!thread)
        return (
            <div>
                Thread not found.
            </div>
        );

    function handleAddComment(text: string) {
        addComment(thread.id, thread.clientId, {
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
            serverId: thread.id,
            clientId: thread.clientId,
            user: userName
        } as LikeDto)
    }

    const CommentElement = (comment: ThreadComment, index: number) => (
        <Comment key={index}>
            <Comment.Avatar src={comment.author.avatarUrl} />
            <Comment.Content>
                <Comment.Author as='a'>{comment.author.name}</Comment.Author>
                <Comment.Metadata>
                    <TimeAgo date={comment.timestamp} />
                </Comment.Metadata>
                <Comment.Text>{comment.text}</Comment.Text>
            </Comment.Content>
        </Comment>
    )

    return (
        <div>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' src={thread.author.avatarUrl} />
                        <Item.Content>
                            <Item.Header>Question</Item.Header>
                            <Item.Meta>
                                By {thread.author.name}
                            </Item.Meta>
                            <Item.Description>
                                {thread.text}
                            </Item.Description>
                            <Feed.Extra style={{ width: '500px'}}>
                                <Feed.Date style={{ display: 'inline' }}><TimeAgo date={thread.timestamp} /></Feed.Date>
                                <Feed.Like onClick={() => handleLike(thread)}>
                                    <Icon style={{ color: (thread.likedBy.indexOf(userName) === -1 ? 'inherit' : '#ff2733') }} name='like' />{thread.likedBy.length} Like{ thread.likedBy.length == 1 ? '' : 's'}
                                </Feed.Like>
                            </Feed.Extra>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>

            <Comment.Group>
                {thread.comments
                    // .filter(thread => player.is_current_team_member === true)
                    .map((comment, index) => (
                        CommentElement(comment, index)
                    ))
                }
            </Comment.Group>



            <Form reply>
                <TextArea placeholder='Post a comment...' value={text} onChange={(e, data) => setText(data.value as string) } />
                <Button type='submit' primary onClick={e => handleAddComment(text)}>
                    <Icon  name='edit' />
                    Submit
                </Button>
            </Form>
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