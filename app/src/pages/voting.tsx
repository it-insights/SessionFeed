import React, {Component, useState, useEffect} from 'react';
import {Route, Redirect, RouteComponentProps, Link} from 'react-router-dom';
import { connect } from "react-redux"
import { ApplicationState } from "../store";
import { vote, dispatchComment, submit, checkVote } from "../store/votes/actions";
 import StarRatingComponent from 'react-star-rating-component';
import {LikeDto, Thread} from "../store/threads/types";
import {VoteCategory, VoteDto} from "../store/votes/types";
import {
    Feed,
    Icon,
    Item,
    Segment,
    Rating,
    Label,
    Form,
    TextArea,
    Button,
    Input,
    Popup,
    Placeholder
} from "semantic-ui-react";
import TimeAgo from "react-timeago";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    categories: string,
    comment: string
    hasVoted: boolean,
    loading: boolean
}

interface PropsFromDispatch {
    vote: typeof vote,
    dispatchComment: typeof dispatchComment,
    submit: typeof submit,
    checkVote: typeof checkVote
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch & any

// @ts-ignore
const VotingPage: React.FC<AllProps> = ({ categories, comment, dispatchComment, checkVote, submit, loading, hasVoted, vote, userName, component: Component, ...params }) => {
    const [ text, setText ] = useState('');
    const [ email, setEmail ] = useState('');

    if (hasVoted === undefined)
        checkVote(userName);

    const canSubmit = () => !categories.every((c: VoteCategory) => c.rating !== 0);

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
            email: email,
            categories
        } as VoteDto)
    }

    const Vote = (category: VoteCategory, index: number) => (
        <Segment key={index}>
            <Item.Group>
                <Item>
                    <Item.Content>
                        <Item.Header>{category.name} *</Item.Header>
                        <Item.Description>
                            <Rating maxRating={5} defaultRating={0} icon='star' size='huge' onRate={(e, data) => handleVote(data.rating as number, category.name)} />
                        </Item.Description>
                        <Feed.Extra style={{ width: '500px'}}>
                            {category.average ?
                                <div>
                                    <span>Total votes: {category.count || 'N/A'}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>Average rating: {category.average || 'N/A'}</span>
                                </div>
                             : 'Please submit your vote to view totals and averages.'}
                        </Feed.Extra>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    )

    return (
        <div>
            { loading ? (
                <div>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                    <Segment raised>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                            </Placeholder.Header>
                            <Placeholder.Paragraph>
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                                <Placeholder.Line fluid length='full' />
                            </Placeholder.Paragraph>
                        </Placeholder>
                    </Segment>
                </div>
            ):(
                <div>
                    {categories
                        .map((category: VoteCategory, index: number) => (
                            Vote(category, index)
                        ))
                    }

                    <Form reply>
                        <TextArea placeholder='Post a comment...' value={text} onChange={(e, data) => setText(data.value as string) } />

                        <span>
                                <Input label='Email' placeholder={`Let's stay in touch!`} value={text} onChange={(e, data) => setEmail(data.value as string) }/>
                        </span>
                        <span>
                            <Popup
                                trigger={<span style={{ marginLeft: '70px' }}><Icon circular size='small' name='info' /></span>}
                                content={<p>In case you have specific questions or you are interested in a conversation. If you submit your E-mail we will personally contact you after the session. We will not give away your E-mail address. Please review our <a href='/imprint'>imprint</a> for further information.</p>}
                                basic
                                hoverable
                            />
                        </span>

                        <br/>
                        <br/>

                        <Button disabled={canSubmit()} type='submit' primary onClick={e => handleSubmit()}>
                            Submit
                        </Button>
                    </Form>
                </div>
                )
            }
        </div>
    )
}

const mapStateToProps = ({ user, votes }: ApplicationState) => ({
    categories: votes.categories,
    userName: user.name,
    comment: votes.comment,
    hasVoted: votes.hasVoted,
    loading: votes.loading
})

const mapDispatchToProps = {
    vote,
    dispatchComment,
    submit,
    checkVote
};

export default connect(mapStateToProps, mapDispatchToProps)(VotingPage)