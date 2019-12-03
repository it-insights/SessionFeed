import React, {Component, useState, useEffect} from 'react';
import {Route, Redirect, RouteComponentProps, Link} from 'react-router-dom';
import { connect } from "react-redux"
import { ApplicationState } from "../store";
import { vote, dispatchComment, submit } from "../store/votes/actions";
 import StarRatingComponent from 'react-star-rating-component';
import {LikeDto, Thread} from "../store/threads/types";
import {VoteCategory, VoteDto} from "../store/votes/types";

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

    function handleVote(nextValue: number, prevValue: number, name: string) {
        vote({
            name,
            rating: nextValue
        } as VoteCategory)
    }

    function handleComment(text: string) {
        dispatchComment(text)
    }

    function handleSubmit() {
        submit({
            author: userName,
            comment: text,
            categories
        } as VoteDto)
    }

    return (
        <div>
            {categories
                .map((category: VoteCategory, index: number) => (
                    <div key={index} >
                        <hr/>
                        <p>{category.name} (Total: {category.count}, Avg: {category.average})</p>
                        <StarRatingComponent
                            name={category.name}
                            // editing={false}
                            starCount={5}
                            value={category.rating}
                            onStarClick={handleVote}
                        />
                        <hr/>
                    </div>
                ))
            }

            <p>Add comment</p>
            <input value={text} onChange={e => setText(e.target.value) } onBlur={e => handleComment(text)} />
            <button onClick={e => handleSubmit()}>Submit</button>
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