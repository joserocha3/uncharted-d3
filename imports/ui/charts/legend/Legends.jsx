/*-------------------------------------------------------------------------*
 * Object name:   Legends.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component to display a section of the Legend.jsx component
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     06/09/2017  Pablo Rocha  - Remove call to method indicators.setColors
 * master  #16.1  06/12/2017  Pablo Rocha  - Add group by toggle section
 *                                         - Replace some lodash with native methods
 * master  #16.2  06/12/2017  Pablo Rocha  - Only display GroupBySection if multiple countries and
 *                                           indicators are selected
 *                                         - Fix recordsIndicators assignment, is was assigning countries
 * master  #18.1  06/12/2017  Pablo Rocha  - Change the no_data_available determinant
 * master  #14.1  06/13/2017  Pablo Rocha  - Hide when ui.presentationMode is true
 * master  #15.1  06/14/2017  Pablo Rocha  - Add line chart to potentially show the group by section
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {sortBy} from 'lodash'

// Components
import Legend from './Legend'
import GroupBySection from './GroupBySection'

// Legends - show list of countries and indicators and whether they will be drawn onto the graph or not
@inject('countries', 'indicators', 'ui') @observer
export default class Legends extends React.Component {

    _onGroupBySectionChange = () => {
        const {ui} = this.props
        ui.setGroupToggle(ui.groupToggle === 'country' ? 'indicator' : 'country')
    }

    render() {

        const {countries, indicators, ui} = this.props

        let recordsCountries,
            noRecordsCountries,
            recordsIndicators,
            noRecordsIndicators

        if (countries.activeIds.length === 0 || indicators.activeIds.length === 0) {
            // Show all as data available we can actually pull any records data, we need at least one
            // indicator and one country to do so
            recordsCountries = sortBy(countries.data.filter(c => c.active), 'nameEn')
            noRecordsCountries = []
            recordsIndicators = sortBy(indicators.data.filter(c => c.active), 'nameEn')
            noRecordsIndicators = []
        } else {
            // Show as data available or not based on records
            recordsCountries = sortBy(countries.data.filter(c => c.active && c.records), 'nameEn')
            noRecordsCountries = sortBy(countries.data.filter(c => c.active && !c.records), 'nameEn')
            recordsIndicators = sortBy(indicators.data.filter(i => i.active && i.records), 'nameEn')
            noRecordsIndicators = sortBy(indicators.data.filter(i => i.active && !i.records), 'nameEn')
        }

        // Only return the no_data_available legends if they have a value

        return (
            <Menu
                id='legends-menu'
                className={ui.presentationMode ? 'presentation-mode' : ''}
                fixed='right'
                borderless
                vertical
            >

                {
                    (ui.activeChartMenuItem === 'bar' || ui.activeChartMenuItem === 'line') &&
                    (recordsCountries.length + noRecordsCountries.length) > 1 &&
                    (recordsIndicators.length + noRecordsIndicators.length) > 1 ?
                        <Menu.Item>
                            <GroupBySection
                                checked={ui.groupToggle === 'indicator'}
                                onChange={this._onGroupBySectionChange}
                            />
                        </Menu.Item> : null
                }

                <Menu.Item>
                    <Legend
                        title={'country_colon'}
                        list={recordsCountries}
                        itemStore={countries}
                    />
                </Menu.Item>

                {noRecordsCountries.length === 0 ? null :
                    <Menu.Item>
                        <Legend
                            title=''
                            list={noRecordsCountries}
                            itemStore={countries}
                            subtitle='no_data_available'
                            disabled={true}
                        />
                    </Menu.Item>
                }

                <Menu.Item>
                    <Legend
                        title={'indicator_colon'}
                        list={recordsIndicators}
                        itemStore={indicators}
                    />
                </Menu.Item>

                {noRecordsIndicators.length === 0 ? null :
                    <Menu.Item>
                        <Legend
                            title=''
                            list={noRecordsIndicators}
                            itemStore={indicators}
                            subtitle='no_data_available'
                            disabled={true}
                        />
                    </Menu.Item>
                }

            </Menu>
        )

    }

}