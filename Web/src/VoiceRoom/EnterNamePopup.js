import React, { Component } from 'react'
import { connect } from 'react-redux'
import { enterName, changeName } from '../Store/Actions/voiceRoomActions'
import styles from './EnterNamePopup.module.css'

export class EnterNamePopup extends Component {

    onSubmit = e => {
        e.preventDefault();
        this.props.enterName();
    }

    render() {
        return (
            <div className={styles['EnterNamePopup-bg']}>
                <form className={styles['EnterNamePopup']} onSubmit={this.onSubmit}>
                    <div className={styles['header']}>What's your name?</div>
                    <input type="text" placeholder="Enter your name" value={this.props.userName} onChange={e => this.props.changeName(e.target.value)} />
                    <input type="submit" value="Join" />
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    userName: state.voiceRoom.userName
})

export default connect(mapStateToProps, { changeName, enterName })(EnterNamePopup)
