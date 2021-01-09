import { NEW_MESSAGE_RECEIVED, SEND_MESSAGE, CHANGE_CURRENT_MESSAGE, CHANGE_NAME, ENTER_NAME, CHANGE_KEY, USERS_LOADED,
     NEW_USER, CHANGE_VOLUME, TOGGLE_MUTE_USER, USER_DISCONNECTED, START_MICROPHONE, STOP_MICROPHONE, START_SOUND, STOP_SOUND, CHANGE_INPUT_VOLUME, CHANGE_OUTPUT_VOLUME, CHANGE_VOLUME_GATE } from './types'
import { startConnection } from './connectionActions'

export const newMessageReceived = (author, content) => dispatch => {
    return dispatch({
        type: NEW_MESSAGE_RECEIVED,
        payload: { author, content }
    });
}

export const sendMessage = message => dispatch => {
    return dispatch({
        type: SEND_MESSAGE,
        payload: message
    });
}

export const changeCurrentMessage = message => dispatch => {
    return dispatch({
        type: CHANGE_CURRENT_MESSAGE,
        payload: message
    });
}

export const changeName = name => dispatch => {
    return dispatch({
        type: CHANGE_NAME,
        payload: name
    });
}

export const enterName = () => async dispatch => {
    await dispatch(startConnection());
    await dispatch(startMicrophone());
    return dispatch({
        type: ENTER_NAME,
    });
}

export const changeKey = (key) => dispatch => {
    return dispatch({
        type: CHANGE_KEY,
        payload: key
    });
}

export const usersLoaded = users => dispatch => {
    return dispatch({
        type: USERS_LOADED,
        payload: users
    });
}

export const newUser = (userId, userName, mimeType) => dispatch => {
    return dispatch({
        type: NEW_USER,
        payload: { userId, userName, mimeType }
    });
}

export const changeVolume = (userId, volume) => dispatch => {
    return dispatch({
        type: CHANGE_VOLUME,
        payload: { userId, volume }
    })
}

export const toggleMuteUser = user => dispatch => {
    return dispatch({
        type: TOGGLE_MUTE_USER,
        payload: user
    })
}

export const userDisconnected = user => dispatch => {
    return dispatch({
        type: USER_DISCONNECTED,
        payload: user
    })
}

export const startMicrophone = () => dispatch => {
    return dispatch({
        type: START_MICROPHONE
    })
}

export const stopMicrophone = () => dispatch => {
    return dispatch({
        type: STOP_MICROPHONE
    })
}

export const startSound = () => dispatch => {
    return dispatch({
        type: START_SOUND
    })
}

export const stopSound = () => dispatch => {
    return dispatch({
        type: STOP_SOUND
    })
}

export const changeInputVolume = value => dispatch => {
    return dispatch({
        type: CHANGE_INPUT_VOLUME,
        payload: value
    })
}
export const changeOutputVolume = value => dispatch => {
    return dispatch({
        type: CHANGE_OUTPUT_VOLUME,
        payload: value
    })
}
export const changeVolumeGate = value => dispatch => {
    return dispatch({
        type: CHANGE_VOLUME_GATE,
        payload: value
    })
}