import {
    SEND_MESSAGE, NEW_MESSAGE_RECEIVED, CHANGE_CURRENT_MESSAGE, CHANGE_NAME, ENTER_NAME, CHANGE_KEY, USERS_LOADED, NEW_USER, CHANGE_VOLUME,
    TOGGLE_MUTE_USER,
    USER_DISCONNECTED,
    START_MICROPHONE,
    STOP_MICROPHONE,
    START_SOUND,
    STOP_SOUND,
    CHANGE_VOLUME_GATE,
    CHANGE_INPUT_VOLUME,
    CHANGE_OUTPUT_VOLUME
} from '../Actions/types'

const initialState = {
    currentMessage: '',
    messages: [],
    userName: '',
    nameEntered: false,
    key: '',
    users: {}, //{userid: {userName, volume, muted}}
    microphoneOn: true,
    soundOn: true,
    inputVolume: 1,
    outputVolume: 1,
    volumeGate: 5
}

export default function voiceRoomReducer(state = initialState, action) {
    switch (action.type) {
        case SEND_MESSAGE:
            return { ...state, currentMessage: '' };
        case NEW_USER:
            return {
                ...state, users: {
                    ...state.users,
                    [action.payload.userId]: {
                        userName: action.payload.userName,
                        volume: 1,
                        muted: false
                    }
                }
            }
        case NEW_MESSAGE_RECEIVED:
            return { ...state, messages: [...state.messages, action.payload] };
        case TOGGLE_MUTE_USER:
            const user = state.users[action.payload];
            return {
                ...state, users: {
                    ...state.users,
                    [action.payload]: { ...user, muted: !user.muted }
                }
            };
        case CHANGE_VOLUME:
            const users = { ...state.users };
            users[action.payload.userId].volume = action.payload.volume;
            return { ...state, users: users }
        case USER_DISCONNECTED:
            const users3 = { ...state.users };
            delete users3[action.payload];
            return { ...state, users: users3 }
        case START_MICROPHONE:
            return { ...state, microphoneOn: true }
        case STOP_MICROPHONE:
            return { ...state, microphoneOn: false }
        case START_SOUND:
            return { ...state, soundOn: true }
        case STOP_SOUND:
            return { ...state, soundOn: false }
        case CHANGE_VOLUME_GATE:
            return { ...state, volumeGate: action.payload }
        case CHANGE_INPUT_VOLUME:
            return { ...state, inputVolume: action.payload }
        case CHANGE_OUTPUT_VOLUME:
            return { ...state, outputVolume: action.payload }

        case CHANGE_CURRENT_MESSAGE:
            return { ...state, currentMessage: action.payload }
        case CHANGE_NAME:
            return { ...state, userName: action.payload }
        case ENTER_NAME:
            return { ...state, nameEntered: true }
        case CHANGE_KEY:
            return { ...state, key: action.payload }
        case USERS_LOADED:
            const users2 = {};
            for (const prop in action.payload) {
                users2[prop] = {
                    userName: action.payload[prop][0],
                    volume: 1,
                    muted: false
                }
            }
            return { ...state, users: users2 }

        default:
            return state;
    }
}