import { CREATE_VOICE_ROOM, CLOSE_POPUP } from './types'
import VoiceRoomApi from '../../API/VoiceRoomApi';

export const createVoiceRoom = () => async dispatch => {
    const roomId = await VoiceRoomApi.createVoiceRoomId();
    return dispatch({
        type: CREATE_VOICE_ROOM,
        payload: roomId
    });
}

export const closePopup = () => dispatch => {
    return dispatch({
        type: CLOSE_POPUP
    });
}