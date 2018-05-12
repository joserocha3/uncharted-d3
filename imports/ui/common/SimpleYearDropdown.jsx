/*-------------------------------------------------------------------------*
 * Object name:   SimpleYearDropdown.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render a drop down for available years and update ui store accordingly
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Call indicators.setShow2015 instead of indicators.setGet2015
 * master  #33.2  07/01/2017  Pablo Rocha  - Disable and add popup when needed
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import {Dropdown, Popup} from 'semantic-ui-react'
import {map} from 'lodash'

// Components
import TAP from './TAP'
import i18n from '../../startup/client/i18n'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class SimpleYearDropdown extends React.Component {

    _onChangeChart = (e, data) => {

        const {countries, indicators, records, ui} = this.props

        records.setChartYear(data.value)
        countries.activateAll(false)
        indicators.activateAll(false)
        indicators.setShow2015(data.value === 2015)
        ui.chartMenuItemClicked('')
        ui.setDisabled()

    }

    _onChangeProfile = (e, data) => {

        const {indicators, records} = this.props

        records.setProfileYear(data.value)
        records.setProfileIndexes([])
        records.setProfilePillars([])
        records.setProfileSubpillars([])
        indicators.setShow2015(data.value === 2015)

    }

    render() {

        const {indicators, records, ui} = this.props

        const indexType = ui.activeNavigationMenuItem === 'chart' ? indicators.chartIndexType : indicators.profileIndexType
        const onChange = ui.activeNavigationMenuItem === 'chart' ? this._onChangeChart : this._onChangeProfile
        const value = ui.activeNavigationMenuItem === 'chart' ? records.chartYear : records.profileYear
        const error = ui.language === 'en' ? i18n.en.translation.reading_index_year_error : i18n.ar.translation.reading_index_year_error
        const position = ui.language === 'en' ? 'right center' : 'left center'
        const offset = ui.language === 'en' ? 15 : 25

        const options = map(records.allYears, year => {

            return indexType === 'RI' && year === 2015 ? {
                key: year,
                text: year,
                value: year,
                content: <Popup offset={offset} content={error} trigger={<div>{year}</div>} position={position} inverted/>,
                disabled: year === 2015
            } : {
                key: year,
                text: year,
                value: year
            }

        })

        return (
            <div>
                <TAP translate='year_colon'/>&nbsp;&nbsp;
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