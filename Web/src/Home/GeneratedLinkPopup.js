import React from 'react';
import { Link } from 'react-router-dom'
import styles from './GeneratedLinkPopup.module.css'
import SvgCopyIcon from './IconComponents/CopyIcon';
import SvgCloseIcon from './IconComponents/CloseIcon';


class GeneratedLinkPopup extends React.Component {
    

    onCopyClick = () => {
        navigator.clipboard.writeText(window.location.host + "/" + this.props.generatedRoute);
    }

    render = () => {
        return (
            <div className={styles['popup-bg']}>
                <div className={styles['GeneratedLinkPopup']}>
                    <div className={styles['close']} onClick={() => this.props.closePopup()}>
                        <SvgCloseIcon />
                    </div>

                    <div className={styles['header']}>
                        This is your ivitation link
                    </div>

                    <div className={styles['description']}>
                        Copy it and send to your friends to allow them to join your Voice Room
                    </div>

                    <div className={styles['url-container']}>
                        <div className={styles['url']}>
                            {window.location.host + "/" + this.props.generatedRoute}
                        </div>
                        <div className={styles['copy-icon-container']} onClick={this.onCopyClick}>
                            <SvgCopyIcon />
                        </div>
                    </div>

                    <div className={styles['footer']}>
                        <Link to={'/' + this.props.generatedRoute}>Join</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default GeneratedLinkPopup;