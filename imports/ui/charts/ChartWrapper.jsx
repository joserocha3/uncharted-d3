/*-------------------------------------------------------------------------*
 * Object name:   ChartWrapper.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component to determine what chart to display and handle chart resizing
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Call indicators.setShow2015 instead of indicators.setGet2015
 * master  #16.2  07/12/2017  Pablo Rocha  - Set style to div containing ChartTitle to avoid flowing over chart
 * master  #14.1  06/13/2017  Pablo Rocha  - Dummy assignment to trigger render on ui.presentationMode change
 * master  #15.1  06/14/2017  Pablo Rocha  - Add line chart component
 * master  #19.3  06/19/2017  Pablo Rocha  - Add OnChartLegend component and adjust SVG height to accommodate it
 * master  #11.1  07/01/2017  Pablo Rocha  - Update source text
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'

// Components
import ChartTitle from '../common/ChartTitle'
import NoDataFound from '../common/NoDataFound'
import BarChart from '../charts/BarChart'
import LineChart from '../charts/LineChart'
import RadarChart from '../charts/RadarChart'
import ScatterChart from '../charts/ScatterChart'
import OnChartLegend from '../charts/legend/OnChartLegend'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class ChartWrapper extends React.Component {

    _onResize = () => {
        const {ui} = this.props
        ui.setChartDimensions(this.wrapper.clientWidth, this.wrapper.clientHeight)
    }

    componentWillMount() {
        window.addEventListener('resize', this._onResize)
    }

    componentDidMount() {

        this._onResize()

        const {countries, indicators, records, ui} = this.props

        countries.activateAll(false)
        indicators.activateAll(false)

        ui.chartMenuItemClicked('')
        ui.setDisabled()

        indicators.setShow2015(records.chartYear === 2015)

    }

    componentDidUpdate() {
        this._onResize()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize)
    }

    render() {

        const {records, ui} = this.props

        const presentationMode = ui.presentationMode // dummy assignment to trigger render on ui.presentationMode change

        const chartComponent =
            ui.activeChartMenuItem === 'bar' ? <BarChart/> :
                ui.activeChartMenuItem === 'line' ? <LineChart/> :
                    ui.activeChartMenuItem === 'radar' ? <RadarChart/> :
                        ui.activeChartMenuItem === 'scatter' ? <ScatterChart/> : null

        if (!chartComponent) return <div id='chart-wrapper' ref={ref => this.wrapper = ref}/>
        if (records.loading) return <div id='chart-wrapper' ref={ref => this.wrapper = ref}/>
        if (records.recordsWithCountryAndIndicatorData.length === 0) return <div id='chart-wrapper' ref={ref => this.wrapper = ref}><NoDataFound/></div>

        // This is translated off the page because we only show it on export, that is also
        // why the svg has + 50 on its height
        const dataSource = (
            <text transform={'translate(' + 10 + ',' + (ui.chartDimensions.height + ui.onChartLegendHeight + 35) + ')'}>
                Data Source: UNDP & MBRF 2016
            </text>
        )

        return (
            <div id='chart-wrapper' ref={ref => this.wrapper = ref}>
                <svg
                    id='svg-chart'
                    height={ui.chartDimensions.height + ui.onChartLegendHeight + 55}
                    width={ui.chartDimensions.width}
                >
                    <ChartTitle width={ui.chartDimensions.width} height={60}/>
                    {chartComponent}
                    <OnChartLegend/>
                    {dataSource}
                </svg>
            </div>
        )

    }

}