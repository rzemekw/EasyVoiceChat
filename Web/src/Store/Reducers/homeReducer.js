import { CREATE_VOICE_ROOM, CLOSE_POPUP } from '../Actions/types'

const initialState = {
    voiceRoomId: ''
}

export default function homeReducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_VOICE_ROOM: {
            return {voiceRoomId: action.payload };
        }

        case CLOSE_POPUP: {
            return { voiceRoomId: '' };
        }

        default:
            return state;
    }
}