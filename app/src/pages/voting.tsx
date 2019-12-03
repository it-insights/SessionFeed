import React, {Component, useState, useEffect} from 'react';
import {Route, Redirect, RouteComponentProps, Link} from 'react-router-dom';
import { connect } from "react-redux"
import { ApplicationState } from "../store";
import { vote, dispatchComment, submit } from "../store/votes/actions";
 import StarRatingComponent from 'react-star-rating-component';
import {LikeDto, Thread} from "../store/threads/types";
import {VoteCategory, VoteDto} from "../store/votes/types";
import {Feed, Icon, Item, Segment, Rating, Label, Form, TextArea, Button} from "semantic-ui-react";
import TimeAgo from "react-timeago";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    categories: string,
    comment: string
}

interface PropsFromDispatch {
    vote: typeof vote,
    dispatchComment: typeof dispatchComment,
    submit: typeof submit
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch & any

// @ts-ignore
const VotingPage: React.FC<AllProps> = ({ categories, comment, dispatchComment, submit, vote, userName, component: Component, ...params }) => {
    const [ text, setText ] = useState('');

    function handleVote(rating: number, name: string) {
        vote({
            name,
            rating: rating
        } as VoteCategory)
    }

    function handleSubmit() {
        submit({
            author: userName,
            comment: text,
            categories
        } as VoteDto)
    }

    const Vote = (category: VoteCategory, index: number) => (
        <Segment key={index}>
            <Item.Group>
                <Item>
                    <Item.Content>
                        <Item.Header>{category.name}</Item.Header>
                        <Item.Description>
                            <Rating maxRating={5} defaultRating={0} icon='star' size='huge' onRate={(e, data) => handleVote(data.rating as number, category.name)} />
                        </Item.Description>
                        <Feed.Extra style={{ width: '500px'}}>
                            <span>Sum: {category.count || 'N/A'}</span>
                            <span>Average: {category.average || 'N/A'}</span>
                        </Feed.Extra>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    )

    return (
        <div>
            {categories
                .map((category: VoteCategory, index: number) => (
                    Vote(category, index)
                ))
            }

            <Form reply>
                <TextArea placeholder='Post a comment...' value={text} onChange={(e, data) => setText(data.value as string) } />
                <Button type='submit' primary onClick={e => handleSubmit()}>
                    <Icon  name='edit' />
                    Submit
                </Button>
            </Form>
        </div>
    )
}

const mapStateToProps = ({ user, votes }: ApplicationState) => ({
    categories: votes.categories,
    userName: user.name,
    comment: votes.comment
})

const mapDispatchToProps = {
    vote,
    dispatchComment,
    submit
};

export default connect(mapStateToProps, mapDispatchToProps)(VotingPage)