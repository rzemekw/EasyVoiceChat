import {combineReducers} from 'redux';

import homeReducer from './homeReducer'
import voiceRoomReducer from './voiceRoomReducer';

export default combineReducers({
    home: homeReducer,
    voiceRoom: voiceRoomReducer
})