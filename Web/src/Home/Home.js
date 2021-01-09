import React from 'react';
import { connect } from 'react-redux';
import { createVoiceRoom, closePopup } from '../Store/Actions/homeActions';
import GeneratedLinkPopup from './GeneratedLinkPopup';
import styles from './Home.module.css'

class Home extends React.Component {

    render = () => {

        if (this.props.voiceRoomId === '') {
            return (
                <div className={styles["Home"]}>
                    <div className={styles["header"]}>
                        Easy Voice Chat
                    </div>

                    <div className={styles["description"]}>
                        No need to register
                    </div>
                    <div className={styles["description"]}>
                        Just create a Voice Room and invite your friend
                    </div>

                    <div className={styles["create"]} onClick={() => this.props.createVoiceRoom()}>
                        Create
                    </div>
                </div>
            )
        }

        return (
            <GeneratedLinkPopup generatedRoute={this.props.voiceRoomId} closePopup={this.props.closePopup}></GeneratedLinkPopup>
        )
    }
}

const mapStateToProps = state => ({
    voiceRoomId: state.home.voiceRoomId
})

export default connect(mapStateToProps, { createVoiceRoom, closePopup })(Home);