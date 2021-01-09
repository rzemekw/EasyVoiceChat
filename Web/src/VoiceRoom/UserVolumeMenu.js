import React, { Component } from 'react'
import { connect } from 'react-redux';
import styles from './UserVolumeMenu.module.css'
import { changeVolume, toggleMuteUser } from '../Store/Actions/voiceRoomActions'

export class UserVolumeMenu extends Component {

    componentDidMount() {
        document.addEventListener('mousedown', this.props.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.props.handleClickOutside);
    }

    toggleMute = e => {
        e.preventDefault();
        this.props.toggleMuteUser(this.props.userId);
    }

    render() {
        const muted = this.props.users[this.props.userId].muted;

        return (
            <div className={styles['UserVolumeMenu']}>
                <div className={styles['volume']}>
                    <label>
                        User Volume: {Math.floor(this.props.users[this.props.userId].volume * 100)}%
                        <input type="range" min="0.01" max="2" step="0.01"
                            value={this.props.users[this.props.userId].volume}
                            onChange={e => this.props.changeVolume(this.props.userId, e.target.value)} />
                    </label>
                </div>
                <div className={styles['mute']}>
                    <div onMouseDown={this.toggleMute}>{muted ? 'Unmute user' : 'Mute user'}</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    users: state.voiceRoom.users
})

export default connect(mapStateToProps, { changeVolume, toggleMuteUser })(UserVolumeMenu)
