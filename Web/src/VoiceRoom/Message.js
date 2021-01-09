import React, { Component } from 'react'
import styles from './Message.module.css'

export default class Message extends Component {
    render() {
        return (
            <div className={styles['Message']}>
                <div className={styles['author']}>{this.props.author}</div>
                <div className={styles['content']}>{this.props.content}</div>
            </div>
        )
    }
}
