/*-------------------------------------------------------------------------*
 * Object name:   ScatterChart.jsx
 * Created by:    Pablo Rocha
 * Creation date:
 * Description:   Component used for X and Y axises
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #9     07/09/2017  Pablo Rocha  - Make labels bold
 * master  #15.1  06/14/2017  Pablo Rocha  - Pass chart prop to Axis
 *                                         - Code cleanup
 * master  #15.5  06/16/2017  Pablo Rocha  - Remove chart prop from Axis, using scaleType instead
 *                                           and no need to pass it in  for this chart
 * master  #15.6  06/16/2017  Pablo Rocha  - Correct modification history
 * master  #19.3  06/19/2017  Pablo Rocha  - Fix dotsData error
 *                                         - Adjust margins for no more subtitle
 *-------------------------------------------------------------------------*/

// Libs
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {scaleLinear, min, max} from 'd3'
import {filter, keys, groupBy, forEach, find, orderBy} from 'lodash'

// Components
import Dots from '../common/Dots'
import Grid from '../common/Grid'
import Axis from '../common/Axis'

// ScatterChart - Component displayed when scatter chart is selected
@inject('countries', 'indicators', 'records', 'ui') @observer
export default class ScatterChart extends Component {

    render() {

        const {countries, indicators, records, ui} = this.props

        const margin = {top: 70, right: 15, bottom: 75, left: 70}
        const width = ui.chartDimensions.width - margin.left - margin.right
        const height = ui.chartDimensions.height - margin.bottom - margin.top

        const recordsData = filter(records.recordsWithCountryAndIndicatorData, {year: records.chartYear})
        const countryIds = countries.activeIds
        const indicatorIds = keys(groupBy(recordsData, 'indicatorId'))

        if (recordsData.length === 0 || indicatorIds.length !== 2 || countryIds.length < 1) return null

        const x = scaleLinear().domain([0, 100]).range([0, width])
        const y = scaleLinear().domain([0, 100]).range([height, 0])

        if (x.domain()[0] === x.domain()[1]) x.domain([x.domain()[0] * .9, x.domain()[0] * 1.1])
        if (y.domain()[0] === y.domain()[1]) y.domain([y.domain()[0] * .9, y.domain()[0] * 1.1])

        const populationScale = scaleLinear()
            .domain([
                min(recordsData, d => d.population) || 0,
                max(recordsData, d => d.population) || 0,
            ])
            .range([5, 25])

        const dotsData = []

        forEach(countryIds, countryId => {

            const records = filter(recordsData, {countryId: countryId})
            const data = {}

            forEach(records, r => {

                data.key = r.countryId
                data.fill = r.countryColor
                data.headerText = r.countryName
                data.headerColor = r.countryColor
                data.radius = populationScale(r.population)
                data.year = r.year

                if (r.indicatorId === indicatorIds[0]) data.cx = r.value
                if (r.indicatorId === indicatorIds[1]) data.cy = r.value

                if (!data.items) data.items = [{text: 'population', color: r.countryColor, value: r.population}]
                data.items.push({text: r.indicatorName, color: r.indicatorColor, value: r.value})

            })

            if (data.items && data.items.length === 3) dotsData.push(data)

        })

        if (dotsData.length === 0) return null

        const mainTransform = 'translate(' + margin.left + ',' + margin.top + ')'

        const xAxisLabel = ui.language === 'en' ? find(indicators.data, {_id: indicatorIds[0]}).nameEn : find(indicators.data, {_id: indicatorIds[0]}).nameAr
        const yAxisLabel = ui.language === 'en' ? find(indicators.data, {_id: indicatorIds[1]}).nameEn : find(indicators.data, {_id: indicatorIds[1]}).nameAr

        return (
            <g transform={mainTransform}>

                <Grid height={height} width={width} scale={x} gridType='vertical'/>
                <Grid height={height} width={width} scale={y} gridType='horizontal'/>

                <Axis height={height} width={width} margin={margin} scale={x} axisType='x' label={xAxisLabel}/>
                <Axis height={height} width={width} margin={margin} scale={y} axisType='y' label={yAxisLabel}/>

                <Dots
                    data={orderBy(dotsData, ['population'], ['desc'])}
                    x={x}
                    y={y}
                    populationScale={populationScale}
                />

            </g>
        )

    }

}