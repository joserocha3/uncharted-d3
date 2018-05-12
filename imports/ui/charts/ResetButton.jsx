/*-------------------------------------------------------------------------*
 * Object name:   ResetButton.jsx
 * Created by:    Pablo Rocha
 * Creation date: 01/01/2017
 * Description:   Component displayed when bar chart is selected
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #13    06/09/2017  Pablo Rocha  - Call recordsIncludingMissingData instead of recordsWithCountryAndIndicatorData
 *                                         - Handle Bars with a null record value, we display now with zero height
 *                                         - Removed some lodash dependencies
 * master  #16.2  06/09/2017  Pablo Rocha  - Set ui.groupToggle to 'country'
 * master  #14.1  06/13/2017  Pablo Rocha  - Corrected some modification history dates
 *                                         - Clean up code
 * master  #14.2  06/13/2017  Pablo Rocha  - Call ui.setPresentationMode(false) on click
 *-------------------------------------------------------------------------*/

// Libs
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Button} from 'semantic-ui-react'

import TAP from '../common/TAP'

@inject('countries', 'indicators', 'ui') @observer
export default class ResetButton extends Component {

    _handleOnClick = () => {

        const {countries, indicators, ui} = this.props

        countries.activateAll(false)
        indicators.activateAll(false)

        ui.setDisabled()
        ui.setGroupToggle('country')
        ui.setPresentationMode(false)

    }

    render() {

        const {countries, indicators, ui} = this.props

        if (countries.activeIds.length === 0 &&
            indicators.activeIds.length === 0 &&
            !ui.activeChartMenuItem) return null

        return (
            <div>
                <Button
                    id='reset-button'
                    compact
                    color='teal'
                    content={<TAP translate='reset'/>}
                    icon='refresh'
                    onClick={this._handleOnClick}
                />
            </div>
        )

    }

}