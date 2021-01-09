import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './ChatMessageForm.module.css'
import { sendMessage, changeCurrentMessage } from '../Store/Actions/voiceRoomActions'

export class ChatMessageForm extends Component {

    onSubmit = e => {
        e.preventDefault();
        if (this.props.currentMessage === '') {
            return;
        }
        this.props.sendMessage(this.props.currentMessage)
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} className={styles['ChatMessageForm']}>
                <input placeholder="Write your message" onChange={e => this.props.changeCurrentMessage(e.target.value)}
                    value={this.props.currentMessage} />
                <button type="submit">Send</button>
            </form>
        )
    }
}

const mapStateToProps = (state) => ({
    currentMessage: state.voiceRoom.currentMessage
})

export default connect(mapStateToProps, { sendMessage, changeCurrentMessage })(ChatMessageForm)
