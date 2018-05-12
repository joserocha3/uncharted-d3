/*-------------------------------------------------------------------------*
 * Object name:   OnChartLegend.jsx
 * Created by:    Pablo Rocha
 * Creation date: 06/19/2017
 * Description:   Used in the chart SVG but hidden from screen, we need this
 *                to show a minimal legend on chart export via PNG. Component
 *                is translated off the page because we only show it on export.
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #19.3  06/19/2017  Pablo Rocha  - Original release
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import {uniqBy} from 'lodash'

// Components
import TAP from '../../common/TAP'

@inject('records', 'ui') @observer
export default class OnChartLegend extends React.Component {

    componentDidMount() {
        const {ui} = this.props
        ui.setOnChartLegendHeight(this.legendDiv.clientHeight)
    }

    componentDidUpdate() {
        const {ui} = this.props
        ui.setOnChartLegendHeight(this.legendDiv.clientHeight)
    }

    render() {

        const {records, ui} = this.props

        const recordsData = records.recordsWithCountryAndIndicatorData

        if (recordsData.length === 0) return null

        let showCountries = false

        switch (ui.activeChartMenuItem) {

            case 'bar':
            case 'line':
                // Indicators on the axes so countries in the legend
                showCountries = ui.groupToggle !== 'country'
                break

            case 'radar':
                // Indicators on the axes so countries in the legend
                showCountries = uniqBy(recordsData, 'indicatorId').length >= 3
                break

            case 'scatter':
                // Indicators always on the axes so countries in the legend
                showCountries = true
                break

        }

        const items = showCountries ? (
            uniqBy(recordsData, 'countryId').map((record, index) =>
                <li key={index} style={{color: record.countryColor, margin: '0 0 5px 0', marginTop: index === 0 ? -14 : ''}}>
                    <TAP text={record.countryName}/>
                </li>
            )
        ) : (
            uniqBy(recordsData, 'indicatorId').map((record, index) =>
                <li key={index} style={{color: record.indicatorColor, margin: '0 0 5px 0', marginTop: index === 0 ? -14 : ''}}>
                    <TAP text={record.indicatorName}/>
                </li>
            )
        )

        const divStyle = {
            columnWidth: '11.5em',
            MozColumnWidth: '11.5em',
            WebkitColumnWidth: '11.5em',
            marginTop: ui.chartDimensions.height
        }

        return (
            <foreignObject
                width={ui.chartDimensions.width}
                height={ui.onChartLegendHeight + ui.chartDimensions.height}
                transform={'translate(' + 10 + ',' + ui.chartDimensions.height + ')'}
            >
                <div xmlns='http://www.w3.org/1999/xhtml' ref={ref => this.legendDiv = ref} style={divStyle}>
                    <ul>{items}</ul>
                </div>
            </foreignObject>
        )

    }

}