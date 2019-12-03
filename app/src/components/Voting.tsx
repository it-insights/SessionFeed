import React, {Component, useState, useEffect} from 'react';
import {Route, Redirect, RouteComponentProps} from 'react-router-dom';
import { connect } from "react-redux"
import { ApplicationState } from "../store";
import { setName, login } from "../store/user/actions";
 import StarRatingComponent from 'react-star-rating-component';
import {LikeDto, Thread} from "../store/threads/types";

// Separate state props + dispatch props to their own interfaces.
interface PropsFromState {
    isAuthenticated: boolean,
}

interface PropsFromDispatch {
    setName: typeof setName
    login: typeof login
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = PropsFromState & RouteComponentProps & PropsFromDispatch & any

// @ts-ignore
const Voting: React.FC<AllProps> = ({ setName, login, isAuthenticated, component: Component, ...params }) => {
    const [ rating, setRating ] = useState();

    const user = localStorage.getItem('user');

    function handleVote(nextValue: number, prevValue: number, name: string) {
        // like({
        //     serverId: thread.serverId,
        //     user: userName
        // } as LikeDto)
    }

    useEffect(() => {
        if (user && !isAuthenticated) {
            setName(user);
            login(user);
        }
    })

    return (
        <div>
            <StarRatingComponent
                name="rate1"
                // editing={false}
                starCount={5}
                value={rating}
                onStarClick={handleVote}
            />
        </div>
    )
}

const mapStateToProps = ({ user }: ApplicationState) => ({
    isAuthenticated: user.isAuthenticated
})

const mapDispatchToProps = {
    setName,
    login
};

export default connect(mapStateToProps, mapDispatchToProps)(Voting)