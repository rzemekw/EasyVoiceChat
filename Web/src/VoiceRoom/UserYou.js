import React, { Component } from 'react'
import styles from './User.module.css'


export default class UserYou extends Component {
    render() {
        return (
            <div className={styles['User']}>
                <div className={styles['user-container']}>
                    <div className={styles["user-name"]}>
                        {this.props.userName}
                    </div>
                </div>
            </div>
        )
    }
}
