import React, { Component } from 'react'
import User from './User'

import { connect } from 'react-redux'
import UserYou from './UserYou';

export class UsersContainer extends Component {
    render() {

        const users = [];

        for (let id in this.props.users) {
            users.push(<User id={id} key={id} userName={this.props.users[id].userName} muted={this.props.users[id].muted} />)
        }

        return (
            <div>
                <UserYou userName={this.props.yourName}/>
                {users}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.voiceRoom.users,
    yourName: state.voiceRoom.userName
})

export default connect(mapStateToProps, {})(UsersContainer)
