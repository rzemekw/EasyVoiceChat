import { GET_OTHER_USERS, START_CONNECTION, JOIN, START_LISTENING, SEND_VOICE, USER_VOICE_ENDED} from './types'

export const startConnection = () => async dispatch => {
    await dispatch({
        type: START_CONNECTION
    });
    return dispatch(join());
}

export const join = () => async dispatch => {
    await dispatch({
        type: JOIN
    });
    return dispatch(getOtherUsers())
}

export const getOtherUsers = () => async dispatch => {
    await dispatch({
        type: GET_OTHER_USERS,
    });
    return dispatch(startListening())
}

export const startListening = () => dispatch => {
    return dispatch({
        type: START_LISTENING,
    });
}

export const sendVoice = (data) => dispatch => {
    return dispatch({
        type: SEND_VOICE,
        payload: data
    });
}

export const userVoiceEnded = id => dispatch => {
    return dispatch({
        type: USER_VOICE_ENDED,
        payload: id
    })
}