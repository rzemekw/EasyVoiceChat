import { USER_SPEAKING, VOICE_ENDED} from './types'

export const userSpeaking = (user, data) => dispatch => {
    return dispatch({
        type: USER_SPEAKING,
        payload: {
            user: user,
            data: data
        }
    })
}

export const voiceEnded = () => dispatch => {
    return dispatch({
        type: VOICE_ENDED
    })
}