import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './Chat.module.css'
import { Scrollbars } from 'react-custom-scrollbars'
import Message from './Message'
import ChatMessageForm from './ChatMessageForm'

export class Chat extends Component {

    render() {
        return (
            <div className={styles['Chat']}>
                <Scrollbars style={{ width: '100%', height: '100%' }}
                    renderThumbVertical={props => <div {...props} className={styles["scroll-bar-thumb"]} />}
                    renderTrackVertical={props => <div {...props} className={styles["scroll-bar-track"]} />}>
                    <div className={styles['messages']}>
                        {this.props.messages.map((m, i) => <Message author={m.author} content={m.content} key={i} />)}
                    </div>
                </Scrollbars>
                <ChatMessageForm />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    messages: state.voiceRoom.messages
})

export default connect(mapStateToProps, {})(Chat)
