import { take, put, call } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import {ThreadsActionTypes} from "./threads/types";

import io from 'socket.io-client';
import * as signalR from '@microsoft/signalr';

import {VoteActionTypes} from "./votes/types";

const ws = io.connect('ws://localhost:8080', {
    reconnection: true,
    transports: ['websocket' ]
});

const connection = new signalR.HubConnectionBuilder()
    .withUrl('https://sessionfeed.azurewebsites.net/api')
    .configureLogging(signalR.LogLevel.Critical)
    .build();

connection.start()
    .then(function () {
        console.log("connected");
    })
    .catch(function (err) {
        return console.error("SignalR error: " + err.toString());
    });


export enum SocketActionTypes {
    INIT = '@@socket/INIT',
    ADD_THREAD = '@@socket/ADD_THREAD',
    ADD_COMMENT = '@@socket/ADD_COMMENT',
    LIKE_THREAD = '@@socket/LIKE_THREAD',
    ADD_VOTE = '@@socket/ADD_VOTE'
}

function initWebsocket() {
    return eventChannel(emitter => {
        ws.on('open', () => {
            console.log('opening...');
            ws.send(JSON.stringify({ channel: "Debug", payload: "Hello." }))
        });

        ws.on('error', (error: any) => {
            console.log('WebSocket error ' + error);
            console.dir(error)
        });

        ws.on('message', (e: any) => {
            console.log('Received message: ' + e);
            let message = null;

            try {
                message = JSON.parse(e)
            } catch(e) {
                console.error(`Error parsing : ${e}`)
                return;
            }

            if (message) {
                const channel = message.channel;
                switch (channel) {
                    case SocketActionTypes.INIT:
                        return emitter({ type: ThreadsActionTypes.INIT_SUCCESS, payload: message.payload });
                    case SocketActionTypes.ADD_THREAD:
                        return emitter({ type: ThreadsActionTypes.ADD_SUCCESS, payload: message.payload });
                    case SocketActionTypes.LIKE_THREAD:
                        return emitter({ type: ThreadsActionTypes.LIKE_SUCCESS, payload: message.payload });
                    case SocketActionTypes.ADD_COMMENT:
                        return emitter({ type: ThreadsActionTypes.ADD_COMMENT_SUCCESS, payload: message.payload });
                    case SocketActionTypes.ADD_VOTE:
                        return emitter({ type: VoteActionTypes.VOTE_SUCCESS, payload: message.payload });
                    default:
                        console.log(`Unknown channel: ${JSON.stringify(e)}`)
                }
            }
        });

        // unsubscribe function
        return () => {
            console.log('Socket off')
        }
    })
}

function initSignalR() {
    return eventChannel(emitter => {
        connection.on('message', (payload: string) => {
            console.log('Received message: ' + payload);

            let message = {} as any;
            try {
                message = JSON.parse(payload);
            } catch(e) {
                console.error(`Error parsing : ${e}`)
                return;
            }

            if (message) {
                const channel = message.channel;
                switch (channel) {
                    case SocketActionTypes.INIT:
                        return emitter({ type: ThreadsActionTypes.INIT_SUCCESS, payload: message.payload });
                    case SocketActionTypes.ADD_THREAD:
                        return emitter({ type: ThreadsActionTypes.ADD_SUCCESS, payload: message.payload });
                    case SocketActionTypes.LIKE_THREAD:
                        return emitter({ type: ThreadsActionTypes.LIKE_SUCCESS, payload: message.payload });
                    case SocketActionTypes.ADD_COMMENT:
                        return emitter({ type: ThreadsActionTypes.ADD_COMMENT_SUCCESS, payload: message.payload });
                    case SocketActionTypes.ADD_VOTE:
                        return emitter({ type: VoteActionTypes.VOTE_SUCCESS, payload: message.payload });
                    default:
                        console.log(`Unknown channel: ${JSON.stringify(payload)}`)
                }
            }
        });

        // unsubscribe function
        return () => {
            console.log('Socket off')
        }
    })
}

export function* socketSaga() {
    const channel = yield call(initWebsocket);
    while (true) {
        const action = yield take(channel);
        yield put(action)
    }
}