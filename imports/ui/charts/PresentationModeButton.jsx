/*-------------------------------------------------------------------------*
 * Object name:   PresentationModeButton.jsx
 * Created by:    Pablo Rocha
 * Creation date: 06/13/2017
 * Description:   Toggle presentation mode
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #14.1  06/13/2017  Pablo Rocha  - Original release
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import {Button, Popup} from 'semantic-ui-react'

// Components
import TAP from '../common/TAP'

@inject('countries', 'indicators', 'ui') @observer
export default class PresentationModeButton extends React.Component {

    _handleOnClick = () => {
        const {ui} = this.props
        ui.setPresentationMode(!ui.presentationMode)
    }

    componentDidMount() {
        const {ui} = this.props
        ui.setPresentationMode(false)
    }

    componentWillUnmount() {
        const {ui} = this.props
        ui.setPresentationMode(false)
    }

    render() {

        const {ui} = this.props

        if (!ui.activeChartMenuItem) return null

        return (
            <Popup
                trigger={
                    <div>
                        <Button
                            className='white'
                            active={ui.presentationMode}
                            compact
                            icon='desktop'
                            onClick={this._handleOnClick}
                        />
                    </div>
                }
                content={<TAP translate='presentation_mode'/>}
                position='bottom center'
                inverted
            />
        )

    }

}