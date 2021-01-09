import UserVoicePlayer from "./userVoicePlayer";

export default class UserVoicesManager {

    constructor(users) {
        this._userPlayers = new Map();

        this._context = new AudioContext();

        for (const prop in users) {

            this._userPlayers.set(prop, new UserVoicePlayer(users[prop][1], this._context));
        }
    }

    muted = false;

    playSound(user, data) {
        if (this.muted) {
            return;
        }
        this._userPlayers.get(user).playSound(data);
    }

    changeVolume(user, volume) {
        this._userPlayers.get(user).changeVolume(volume);
    }

    addUser(user, mimeType) {
        this._userPlayers.set(user, new UserVoicePlayer(mimeType, this._context));
    }

    deleteUser(user) {
        this._userPlayers.delete(user);
    }

    toggleMuteUser(user) {
        this._userPlayers.get(user).toggleMuteUser();
    }

    startSound() {
        this.muted = false;
    }

    stopSound() {
        this.muted = true;
    }

    voiceEnded(user) {
        this._userPlayers.get(user).voiceEnded();
    }


}