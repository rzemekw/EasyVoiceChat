import { ANALIZER_FFT_SIZE, ANALIZER_SMOOTH, MAX_RECORD_SIZE, RECORD_TIMESLICE } from './consts'

const options = { audioBitRate: 128000 };

if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
    options['mimeType'] = 'audio/webm;codecs=opus'
}

console.log(options);

export default class VoiceCapture {

    constructor() {
        this.gate = 5;
        this._context = new AudioContext();
        this._gain = this._context.createGain();
        this._analyser = this._context.createAnalyser();
        this._analyser.fftSize = ANALIZER_FFT_SIZE;
        this._analyser.smoothingTimeConstant = ANALIZER_SMOOTH;
        this._stream = this._context.createMediaStreamDestination();
        this._recorder = new MediaRecorder(this._stream.stream, options)
        this._recorder.addEventListener('dataavailable', this._onDataAvailable);
        this._recorder.addEventListener('stop', this._onStop);
    }

    onVoiceCaptured = null;
    onEnded = null;
    onStart = null;
    _analyserBuf = new Uint8Array(ANALIZER_FFT_SIZE / 2);
    _capturing = false;
    _stopped = false;

    stop() {
        if(this._microphone.state === 'recording') {
            try {
                this._stopCapturing();
            }
            catch(e) {
                console.error(e);
            }
        }
        this._microphone.getTracks().forEach(t => t.stop());
        this._source.disconnect();
        this._gain.disconnect();
        this._analyser.disconnect();
    }

    getMimeType() {
        return options.mimeType;
    }

    async start() {
        if (this._context.state === 'suspended') {
            this._context.resume();
        }

        this._microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
        this._source = this._context.createMediaStreamSource(this._microphone);
        this._source.connect(this._gain);
        this._gain.connect(this._analyser);
        this._analyser.connect(this._stream);
        this._startCapturing();
    };

    _stopCapturing() {
        this._recorder.stop();
        if (this._size !== 0 && this.onEnded !== null) {
            this._stopped = true;
            this.onEnded();
        }
    }

    _onStop = () => {
        this._stopped = false;
    }

    _startCapturing() {
        this._size = 0;
        this._recorder.start(RECORD_TIMESLICE);
    }

    _resetCapturing() {
        this._stopCapturing();
        this._startCapturing();
    }

    _onDataAvailable = e => {

        if (this.onVoiceCaptured === null || this.onVoiceCaptured === undefined) {
            return;
        }

        if (e.data.size === 0) {
            return;
        }

        if(this._stopped === true) {
            this._stopped = false;
            return;
        }

        if (this._calculateVolume() < this.gate) {
            this._resetCapturing();
            return;
        }

        this._size += e.data.size;

        e.data.arrayBuffer().then(data => {
            this.onVoiceCaptured(new Uint8Array(data));
            if (this._size >= MAX_RECORD_SIZE) {
                this._resetCapturing();
            }
        })
    }

    _calculateVolume() {
        this._analyser.getByteFrequencyData(this._analyserBuf);
        return this._analyserBuf[0];
    }

    changeVolume(volume) {
        this._gain.gain.value = volume;
    }
}