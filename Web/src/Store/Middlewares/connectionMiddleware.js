import { HubConnectionBuilder, Subject } from '@microsoft/signalr'
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'
import { newMessageReceived, newUser, userDisconnected, usersLoaded } from '../Actions/voiceRoomActions'
import { userSpeaking } from '../Actions/soundActions'
import { SEND_MESSAGE, START_CONNECTION, CLOSE_CONNECTION, JOIN, GET_OTHER_USERS, START_LISTENING, SEND_VOICE, VOICE_ENDED } from '../Actions/types'
import { userVoiceEnded } from '../Actions/connectionActions'

const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:5001/hubs/voiceRoom')
    .withHubProtocol(new MessagePackHubProtocol())
    .build();

let subject = null;

export const connectionMiddleware = storeAPI => {
    connection.on("NewMessage", (userId, message) => {
        let user = storeAPI.getState().voiceRoom.users[userId];
        if (user === undefined) {
            if (userId === connection.connectionId) {
                user = { userName: storeAPI.getState().voiceRoom.userName };
            }
        }
        if (user !== undefined) {
            storeAPI.dispatch(newMessageReceived(user.userName, message));
        }
    });
    connection.on("NewUser", (id, name, mimeType) => {
        storeAPI.dispatch(newUser(id, name, mimeType));
    });
    connection.on("UserDisconnected", id => {
        storeAPI.dispatch(userDisconnected(id));
    });

    connection.on("VoiceEnded", id => {
        storeAPI.dispatch(userVoiceEnded(id));
    });


    return next => async action => {
        switch (action.type) {
            case SEND_MESSAGE:
                connection.invoke('SendMessage', action.payload);
                return next(action);

            case SEND_VOICE:
                if (subject === null) {
                    subject = new Subject();
                    await connection.send("SendVoice", subject);
                }
                await subject.next(action.payload);
                return next(action);

            case VOICE_ENDED:
                try {
                    subject.complete()
                    subject = null;
                }
                catch(e) {
                    console.error(e);
                }
                return next(action);

            case START_LISTENING:
                try {
                    connection.stream('StartListening')
                        .subscribe({
                            next: (item) => {
                                storeAPI.dispatch(userSpeaking(item[0], item[1]))
                            }
                        });
                }
                catch (e) {
                    console.error(e);
                }
                return next(action);

            case START_CONNECTION:
                try {
                    await connection.start();
                }
                catch (e) {
                    console.error('SignalR Connection Error: ', e);
                };
                return next(action);

            case JOIN:
                try {
                    await connection.invoke("Join", storeAPI.getState().voiceRoom.key, storeAPI.getState().voiceRoom.userName, action.payload);
                }
                catch (e) {
                    console.error(e);
                }
                return next(action);

            case GET_OTHER_USERS:
                try {
                    await connection.invoke("GetOtherUsers").then(val => storeAPI.dispatch(usersLoaded(val)));
                }
                catch (e) {
                    console.log(e);
                }
                return next(action);

            case CLOSE_CONNECTION:
                try {
                    await connection.stop();
                }
                catch (e) {
                    console.log(e);
                }
                return next(action);


            default:
                return next(action);
        }
    }
}