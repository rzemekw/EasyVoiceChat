import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './SettingsPopup.module.css'
import { changeInputVolume, changeOutputVolume, changeVolumeGate } from '../Store/Actions/voiceRoomActions'

export class SettingsPopup extends Component {
    render() {
        return (
            <div className={styles['SettingsPopup-bg']}>
                <div className={styles['SettingsPopup']}>
                    <div className={styles['input-volume']}>
                        <label>
                            Input Volume: {Math.floor(this.props.inputVolume * 100)}%
                            <input type="range" min="0.01" max="2" step="0.01"
                                value={this.props.inputVolume}
                                onChange={e => this.props.changeInputVolume( e.target.value)}
                            />
                        </label>
                    </div>

                    <div className={styles['output-volume']}>
                        <label>
                            Output Volume: {Math.floor(this.props.outputVolume * 100)}%
                            <input type="range" min="0.01" max="2" step="0.01"
                                value={this.props.outputVolume}
                                onChange={e => this.props.changeOutputVolume( e.target.value)}
                            />
                        </label>
                    </div>

                    <div className={styles['volume-gate']}>
                        <label>
                            Volume Gate
                            <input type="range" min="1" max="255"
                                value={this.props.volumeGate}
                                onChange={e => this.props.changeVolumeGate( e.target.value)}
                            />
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    inputVolume: state.voiceRoom.inputVolume,
    outputVolume: state.voiceRoom.outputVolume,
    volumeGate: state.voiceRoom.volumeGate
})

export default connect(mapStateToProps, { changeInputVolume, changeOutputVolume, changeVolumeGate })(SettingsPopup)
