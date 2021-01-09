import { USER_SPEAKING, USERS_LOADED, NEW_USER, CHANGE_VOLUME, TOGGLE_MUTE_USER,
    START_MICROPHONE, STOP_MICROPHONE, START_SOUND, STOP_SOUND, USER_VOICE_ENDED, JOIN } from '../Actions/types'
import VoiceCapture from '../../SoundLogic/voiceCapture'
import UserVoicesManager from '../../SoundLogic/userVoicesManager'
import { sendVoice } from '../Actions/connectionActions'
import { startMicrophone, startSound, stopMicrophone } from '../Actions/voiceRoomActions';
import { voiceEnded } from '../Actions/soundActions';

const voiceCapture = new VoiceCapture();
let userVoicesManager = null;

export const soundMiddleware = storeAPI => {

    voiceCapture.onVoiceCaptured = e => {
        storeAPI.dispatch(sendVoice(e));
    };

    voiceCapture.onEnded = () => {
        storeAPI.dispatch(voiceEnded());
    }

    return next => action => {
        switch (action.type) {
            case USER_VOICE_ENDED:
                userVoicesManager.voiceEnded(action.payload);
                return next(action);

            case USER_SPEAKING:
                if (userVoicesManager !== null) {
                    userVoicesManager.playSound(action.payload.user, action.payload.data);
                }
                return next(action);

            case CHANGE_VOLUME:
                userVoicesManager.changeVolume(action.payload.userId, action.payload.volume);
                return next(action);

            case START_MICROPHONE:
                voiceCapture.start();
                if (userVoicesManager.muted) {
                    storeAPI.dispatch(startSound());
                }
                return next(action);

            case STOP_MICROPHONE:
                voiceCapture.stop();
                return next(action);

            case START_SOUND:
                userVoicesManager.startSound();
                if (!storeAPI.getState().voiceRoom.microphoneOn) {
                    storeAPI.dispatch(startMicrophone());
                }
                return next(action);

            case STOP_SOUND:
                if (storeAPI.getState().voiceRoom.microphoneOn) {
                    storeAPI.dispatch(stopMicrophone());
                }
                userVoicesManager.stopSound();
                return next(action);

            case TOGGLE_MUTE_USER:
                userVoicesManager.toggleMuteUser(action.payload);
                return next(action);

            case NEW_USER:
                if (userVoicesManager !== null) {
                    userVoicesManager.addUser(action.payload.userId, action.payload.mimeType);
                }
                return next(action);

            case USERS_LOADED:
                userVoicesManager = new UserVoicesManager(action.payload);
                return next(action);

            case JOIN:
                return next({...action, payload: voiceCapture.getMimeType()})

            default:
                return next(action);
        }
    }
}