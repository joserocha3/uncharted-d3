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
 * master  #14.1  06/13/2017  Pablo Rocha  - Add PresentationModeButton
 * master  #15.1  06/14/2017  Pablo Rocha  - Add line chart menu item
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

// Components
import ChartMenuItem from './ChartMenuItem'
import ResetButton from '../ResetButton'
import PresentationModeButton from '../PresentationModeButton'
import TAP from '../../common/TAP'
import StepPopup from '../../common/StepPopup'

@inject('ui') @observer
export default class ChartMenu extends React.Component {

    render() {

        const {ui} = this.props

        return (
            <Menu
                id='chart-menu'
                className='centered'
                fixed='top'
                borderless
            >

                <Menu.Item header>
                    <StepPopup step={3}/>
                </Menu.Item>

                <ChartMenuItem name='bar' disabled={ui.barDisabled} popupText={<TAP translate='bar_chart_requirements'/>}/>
                <ChartMenuItem name='line' disabled={ui.lineDisabled} popupText={<TAP translate='line_chart_requirements'/>}/>
                <ChartMenuItem name='radar' disabled={ui.radarDisabled} popupText={<TAP translate='radar_chart_requirements'/>}/>
                <ChartMenuItem name='scatter' disabled={ui.scatterDisabled} popupText={<TAP translate='scatter_chart_requirements'/>}/>

                <Menu.Item id='chart-menu-auxiliary-buttons'>
                    <PresentationModeButton/>
                    <ResetButton/>
                </Menu.Item>

            </Menu>
        )

    }

}