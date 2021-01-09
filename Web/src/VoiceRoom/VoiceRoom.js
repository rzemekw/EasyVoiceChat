import React from 'react'
import { withRouter } from 'react-router-dom'
import styles from './VoiceRoom.module.css'
import Chat from './Chat'
import SvgMicOffIcon from './IconComponents/MicOffIcon'
import SvgMicOnIcon from './IconComponents/MicOnIcon'
import SvgSoundOnIcon from './IconComponents/SoundOnIcon'
import SvgMutedIcon from './IconComponents/MutedIcon'
import SvgSettingsIcon from './IconComponents/SettingsIcon'
import EnterNamePopup from './EnterNamePopup';
import SettingsPopup from './SettingsPopup';
import { connect } from 'react-redux';
import { changeKey, startMicrophone, stopMicrophone, startSound, stopSound } from '../Store/Actions/voiceRoomActions';
import UserContainer from './UsersContainer';

class VoiceRoom extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            settingsOpen: false
        }
    }

    componentDidMount() {
        this.props.changeKey(this.props.location.pathname.substring(1))
    }

    // componentWillUnmount() {
    //     this.voiceCapture.stopCapturing();
    // }


    render = () => {
        if (this.props.nameEntered === false) {
            return <EnterNamePopup />
        }

        return (
            <div className={styles['VoiceRoom']}>
                {this.state.settingsOpen && <SettingsPopup />}
                <div className={styles['left-panel']}>
                    <UserContainer />

                    <div className={styles['settings-container']}>
                        <div className={styles['left-icons']}>
                            <div onClick={this.props.microphoneOn ? this.props.stopMicrophone : this.props.startMicrophone}>
                                {this.props.microphoneOn ? <SvgMicOnIcon /> : <SvgMicOffIcon />}
                            </div>
                            <div onClick={this.props.soundOn ? this.props.stopSound : this.props.startSound}>
                                {this.props.soundOn ? <SvgSoundOnIcon /> : <SvgMutedIcon />}
                            </div>
                        </div>
                        <div className={styles['right-icons']}>
                            <div onClick={() => this.setState({ settingsOpen: true })}>
                                <SvgSettingsIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <Chat />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    nameEntered: state.voiceRoom.nameEntered,
    microphoneOn: state.voiceRoom.microphoneOn,
    soundOn: state.voiceRoom.soundOn
})

export default connect(mapStateToProps, { changeKey, startMicrophone, stopMicrophone, startSound, stopSound })(withRouter(VoiceRoom));