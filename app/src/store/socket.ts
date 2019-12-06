import { take, put, call } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import {ThreadsActionTypes} from "./threads/types";

import io from 'socket.io-client';
import * as signalR from '@microsoft/signalr';

import {VoteActionTypes} from "./votes/types";

const endpoint: string = process.env.REACT_APP_SOCKET_ENDPOINT || 'https://sessionfeed.azurewebsites.net/api';
const mockEndpoint: string = process.env.REACT_APP_MOCK_SOCKET_ENDPOINT || 'http://localhost:8080';
const useMockSocket: boolean = process.env.REACT_APP_USE_MOCK_SOCKET === 'true'

let ws :any

if (useMockSocket) {
    ws = io.connect(mockEndpoint, {
        reconnection: true,
        transports: ['websocket' ]
    });
} else {
    ws = new signalR.HubConnectionBuilder()
        .withUrl(endpoint)
        .configureLogging(signalR.LogLevel.Critical)
        .build();

    ws.start()
        .then(function () {
            console.log("connected");
        })
        .catch(function (err :any) {
            return console.error("SignalR error: " + err.toString());
        });
}

enum SocketActionTypes {
    INIT = '@@socket/INIT',
    UPDATE_THREAD = '@@socket/UPDATE_THREAD',
    UPDATE_VOTE = '@@socket/UPDATE_VOTE'
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
            var x = process.env;

            console.log('Received message: ' + JSON.stringify(e));
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
                        emitter({ type: ThreadsActionTypes.INIT_SUCCESS, payload: message.payload[0] });
                        emitter({ type: VoteActionTypes.INIT_SUCCESS, payload: message.payload[1] });
                        return;
                    case SocketActionTypes.UPDATE_THREAD:
                        return emitter({ type: ThreadsActionTypes.UPDATE, payload: message.payload });
                    case SocketActionTypes.UPDATE_VOTE:
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
        ws.on('message', (message: any) => {
            console.log('Received message: ' + JSON.stringify(message));

            if (message) {
                const channel = message.channel;
                switch (channel) {
                    case SocketActionTypes.INIT:
                        emitter({ type: ThreadsActionTypes.INIT_SUCCESS, payload: message.payload[0] });
                        emitter({ type: VoteActionTypes.INIT_SUCCESS, payload: message.payload[1] });
                        return;
                    case SocketActionTypes.UPDATE_THREAD:
                        return emitter({ type: ThreadsActionTypes.UPDATE, payload: message.payload });
                    case SocketActionTypes.UPDATE_VOTE:
                        return emitter({ type: VoteActionTypes.VOTE_SUCCESS, payload: message.payload });
                    default:
                        console.log(`Unknown channel: ${JSON.stringify(message)}`)
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
    const channel = yield call(useMockSocket ? initWebsocket : initSignalR);
    while (true) {
        const action = yield take(channel);
        yield put(action)
    }
}