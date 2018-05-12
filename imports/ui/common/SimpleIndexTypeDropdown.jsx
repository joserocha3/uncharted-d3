/*-------------------------------------------------------------------------*
 * Object name:   SimpleIndexTypeDropdown.jsx
 * Created by:    Pablo Rocha
 * Creation date: 07/01/2017
 * Description:   Component to render a drop down for available index types and update ui store accordingly
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #33.1  07/01/2017  Pablo Rocha  - Original release
 * master  #33.2  07/01/2017  Pablo Rocha  - Disable and add popup when needed
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import {Dropdown, Popup} from 'semantic-ui-react'

// Components
import TAP from './TAP'
import i18n from '../../startup/client/i18n'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class SimpleIndexTypeDropdown extends React.Component {

    _onChangeChart = (e, data) => {

        const {countries, indicators, ui} = this.props

        indicators.setChartIndexType(data.value)
        indicators.activateAll(false)
        countries.activateAll(false)
        ui.chartMenuItemClicked('')
        ui.setDisabled()

    }

    _onChangeProfile = (e, data) => {

        const {indicators, records} = this.props

        indicators.setProfileIndexType(data.value)
        records.setProfileIndexes([])
        records.setProfilePillars([])
        records.setProfileSubpillars([])

    }

    render() {

        const {indicators, records, ui} = this.props

        const value = ui.activeNavigationMenuItem === 'chart' ? indicators.chartIndexType : indicators.profileIndexType
        const onChange = ui.activeNavigationMenuItem === 'chart' ? this._onChangeChart : this._onChangeProfile
        const year = ui.activeNavigationMenuItem === 'chart' ? records.chartYear : records.profileYear

        const kiText = ui.language === 'en' ? i18n.en.translation.knowledge_index_index_type_dropdown : i18n.ar.translation.knowledge_index_index_type_dropdown
        const riText = ui.language === 'en' ? i18n.en.translation.reading_index_index_type_dropdown : i18n.ar.translation.reading_index_index_type_dropdown
        const error = ui.language === 'en' ? i18n.en.translation.reading_index_year_error : i18n.ar.translation.reading_index_year_error
        const position = ui.language === 'en' ? 'right center' : 'left center'
        const offset = ui.language === 'en' ? 15 : 25

        const options = [{
            key: 'KI',
            text: kiText,
            value: 'KI'
        }, {
            key: 'RI',
            text: riText,
            value: 'RI',
            content: year === 2015 ? <Popup offset={offset} content={error} trigger={<div>{riText}</div>} position={position} inverted/> : <div>{riText}</div>,
            disabled: year === 2015
        }]

        return (
            <div>
                <TAP translate='index_index_type_dropdown'/>:&nbsp;&nbsp;
                <Dropdown
                    simple
                    options={options}
                    value={value}
                    onChange={onChange}
                />
            </div>
        )

    }

}