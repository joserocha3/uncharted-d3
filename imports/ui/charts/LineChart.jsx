/*-------------------------------------------------------------------------*
 * Object name:   LineChart.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component displayed when line chart is selected
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #15.1  06/14/2017  Pablo Rocha  - Rewrite so we no longer have year on the
 *                                           X axis, instead we use whatever is being grouped
 * master  #15.2  06/14/2017  Pablo Rocha  - Add line break for countries/indicators with no record.value
 * master  #15.3  06/14/2017  Pablo Rocha  - Correct condition to exclude all null value records
 * master  #15.5  06/16/2017  Pablo Rocha  - Change X axis to 'group' to it resembles bar chart
 * master  #15.6  06/16/2017  Pablo Rocha  - Correct modification history
 * master  #10.1  06/17/2017  Pablo Rocha  - Pass width to Axis for font size calculation
 *                                         - Increase margin for larger font sizes
 * master  #19.3  06/19/2017  Pablo Rocha  - Adjust margins for no more subtitle
 * master  #34.1  07/01/2017  Pablo Rocha  - Add drop in animation
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import d3 from 'd3'
import {keys, groupBy} from 'lodash'
import TweenMax from 'gsap'

// Components
import Line from '../common/Line'
import Dots from '../common/Dots'
import Grid from '../common/Grid'
import Axis from '../common/Axis'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class LineChart extends React.Component {

    _animateIn = () => {
        TweenMax.to(this.linesDots, .75, {
            ease: TweenMax.Back.easeOut.config(1.2),
            transform: 'translate(0,0)',
            attr: {opacity: 1}
        })
    }

    componentDidUpdate(prevProps, prevState) {
        TweenMax.to(this.linesDots, 0, {
            transform: 'translate(0,-1000px)', // use px since its not react
            attr: {opacity: 0},
            onComplete: this._animateIn
        })
    }

    componentDidMount() {
        this._animateIn()
    }

    render() {

        const {countries, indicators, records, ui} = this.props

        const recordsData = records.recordsIncludingMissingData
        const indicatorIds = keys(groupBy(recordsData, 'indicatorId'))
        const countryIds = keys(groupBy(recordsData, 'countryId'))
        const countryNames = keys(groupBy(recordsData, 'countryName'))
        const indicatorNames = keys(groupBy(recordsData, 'indicatorName'))

        if (recordsData.length === 0) return null

        const margin = {top: 70, right: 15, bottom: 90, left: 50}
        const width = ui.chartDimensions.width - margin.left - margin.right
        const height = ui.chartDimensions.height - margin.bottom - margin.top

        let countryGroups
        if (countries.activeIds.length === 1 && indicators.activeIds.length > 1) {
            countryGroups = false
        } else if (indicators.activeIds.length === 1 && countries.activeIds.length > 1) {
            countryGroups = true
        } else {
            countryGroups = ui.groupToggle === 'country'
        }

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0])

        // Since X axis is not time based but similar to BarChart we need the bar chart's group scale so we can determine the bar chart's
        // group width and set our lines chart's padding based on that, ultimately our bar and line chart axes look very similar

        const groupScale = d3.scaleBand()
            .domain(countryGroups ? countryIds : indicatorIds)
            .range([0, width])
            .paddingInner((countries.activeIds.length === 1 || indicators.activeIds.length === 1) ? 0 : .1)

        const xPadding = groupScale.bandwidth() / 2

        const x = d3.scaleLinear()
            .domain(countryGroups ? [0, countryIds.length - 1] : [0, indicatorIds.length - 1])
            .range([xPadding, width - xPadding])

        const line = d3.line()
            .defined(d => d.value) // this breaks the line if no value is found
            .curve(d3.curveMonotoneX)
            .y(d => y(d.value))
            .x(d => x(d.index))

        // If countryGroups then country name appears on X axis and we have a line for each indicator, so we want to
        // loop at the one that does not appear on the axis
        const lineIds = countryGroups ? indicatorIds : countryIds

        // Setup the lines, we need one line for each indicator or country

        const lines = lineIds.map(_id => {

            const lineData = recordsData
                .filter(r => countryGroups ? r.indicatorId === _id : r.countryId === _id)
                .map(r => ({
                    value: r.value,
                    index: countryGroups ? countryIds.indexOf(r.countryId) : indicatorIds.indexOf(r.indicatorId),
                    color: countryGroups ? r.indicatorColor : r.countryColor // used in Line props only, all will be the same color
                }))

            return (
                <Line
                    key={_id}
                    d={line(lineData)}
                    stroke={lineData[0].color}
                />
            )

        })

        // Setup the dots to appear on the lines, we only want to look at records that have a value defined

        const dots = lineIds.map(_id => {

            const dotsData = recordsData
                .filter(r => (countryGroups ? r.indicatorId === _id : r.countryId === _id) && r.value)
                .map(r => ({
                    key: r.countryId + r.indicatorId, // used as the key for each dot
                    cx: countryGroups ? countryIds.indexOf(r.countryId) : indicatorIds.indexOf(r.indicatorId),
                    cy: r.value,
                    radius: 5,
                    fill: countryGroups ? r.indicatorColor : r.countryColor,
                    headerText: countryGroups ? r.indicatorName : r.countryName,
                    headerColor: countryGroups ? r.indicatorColor : r.countryColor,
                    items: [{
                        text: countryGroups ? r.countryName : r.indicatorName,
                        color: countryGroups ? r.countryColor : r.indicatorColor,
                        value: r.value
                    }]
                }))

            return (
                <Dots
                    key={_id}
                    data={dotsData}
                    x={x}
                    y={y}
                />
            )

        })

        // Setup transform then render the chart, lines then dots so the dots appear on top

        const mainTransform = 'translate(' + margin.left + ',' + margin.top + ')'
        const linesDotsTransform = 'translate(0,-1000)' // leave off the px for react
        const tickValues = countryGroups ? countryNames : indicatorNames

        return (

            <g transform={mainTransform}>

                <Grid height={height} width={width} scale={y} gridType='horizontal'/>

                <Axis height={height} width={width} scale={groupScale} scaleType='group' axisType='x' tickValues={tickValues} wrap chart='bar'/>
                <Axis height={height} width={width} scale={y} axisType='y'/>

                <g ref={ref => this.linesDots = ref} transform={linesDotsTransform} opacity={0}>
                    {lines}
                    {dots}
                </g>

            </g>
        )

    }

}