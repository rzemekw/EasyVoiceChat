import React, { Component } from 'react'
import SvgMutedIcon from './IconComponents/MutedIcon'
import styles from './User.module.css'
import UserVolumeMenu from './UserVolumeMenu'


export default class User extends Component {

    constructor(props) {
        super(props)

        this.state = {
            menuActive: false
        }

        this.mainRef = React.createRef();
    }

    handleClickOutside = e => {
        if (!this.mainRef.current.contains(e.target)) {
            this.setState({ menuActive: false });
        }
    }

    handleUserClick = e => {
        e.preventDefault();
        this.setState(state => ({ menuActive: !state.menuActive }))
    }


    render() {
        const userClasses = [styles["User"]];
        if (this.state.menuActive) {
            userClasses.push(styles["active"]);
        }

        return (
            <div ref={this.mainRef} className={userClasses.join(' ')}>
                <div className={styles['user-container']} onMouseDown={this.handleUserClick}>
                    <div className={styles["user-name"]}>
                        {this.props.userName}
                    </div>
                    <div className={styles["muted-icon"]}>
                        {this.props.muted && <SvgMutedIcon />}
                    </div>
                </div>
                {this.state.menuActive && <UserVolumeMenu userId={this.props.id} handleClickOutside={this.handleClickOutside}/>}
            </div>
        )
    }
}
