export default class UserVoicePlayer {
    constructor(mimeType, context) {
        this._mime = mimeType;
        this._context = context;

        this._gainNode = context.createGain();
        this._gainNode.connect(context.destination);
        this._muted = false;
        this._voiceEnded = true;
    }

    playSound(data) {
        if (this._muted) {
            return;
        }

        try {
            if (this._voiceEnded === true) {
                this._voiceEnded = false;

                const audio = new Audio();
                audio.autoplay = true;
                const source = this._context.createMediaElementSource(audio);
                source.connect(this._gainNode);

                this._audio = audio;
                this._source = source;

                this._mediaSource = new MediaSource();
                this._mediaSource.addEventListener('sourceopen', () => {
                    try {
                        this._sourceBuffer = this._mediaSource.addSourceBuffer(this._mime);
                    }
                    catch(e) {
                        console.error(e);
                        this._voiceEnded = true;
                    }
                    try {
                        this._sourceBuffer.appendBuffer(data);
                    }
                    catch (e) {
                        this._voiceEnded = true;
                        console.error(e);
                        URL.revokeObjectURL(audio.src);    
                        source.disconnect();
                    }
                });

                audio.src = URL.createObjectURL(this._mediaSource);

            }
            else {
                this._sourceBuffer.appendBuffer(data);
            }
        }
        catch (e) {
            console.error(e);
        }


    }

    voiceEnded() {
        this._voiceEnded = true;
        if (this._audio === undefined || this._muted === true) {
            return;
        }
        const audio = this._audio;
        const mediaSource = this._mediaSource;
        const source = this._source;
        this._sourceBuffer.addEventListener('updateend', () => {
            try {
                mediaSource.endOfStream();
                URL.revokeObjectURL(audio.src);
                source.disconnect();
            }
            catch(e) {
                console.error(e);
            }
        });
    }

    changeVolume(volume) {
        this._gainNode.gain.value = volume;
    }

    toggleMuteUser() {
        this._muted = !this._muted;
    }
}