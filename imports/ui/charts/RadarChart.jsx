/*-------------------------------------------------------------------------*
 * Object name:   RadarChart.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component displayed when radar chart is selected
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #19.3  06/19/2017  Pablo Rocha  - Adjust margins for no more subtitle
 *-------------------------------------------------------------------------*/

// Libs
import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Popup, List, Divider} from 'semantic-ui-react'
import {selectAll, select, scaleLinear, range, radialLine, curveCardinalClosed} from 'd3'
import {sortBy, forEachRight, filter, find, size, map, forEach, round, isNumber} from 'lodash'

// Components
import TAP from '../common/TAP'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class RadarChart extends Component {

    state = {blobsSorted: false}

    opacityArea = .01 // The opacity of the area of the blob

    componentDidMount() {
        this.setState({blobsSorted: true})
    }

    componentDidUpdate() {
        this._sortBlobs()
    }

    _sortBlobs() {
        const wrappers = document.getElementsByClassName('radar-wrapper')
        const sortedWrappers = sortBy(wrappers, w => w.childNodes[0].getTotalLength())
        forEachRight(sortedWrappers, w => w.parentNode.appendChild(w))
    }

    _blobOnMouseOver = event => {

        // Reset all blobs
        selectAll('.radar-area')
            .transition().duration(200)
            .style('fill-opacity', this.opacityArea)

        // Bring back the hovered over blob
        select(event.target)
            .transition().duration(200)
            .style('fill-opacity', 0.6)

    }

    _blobOnMouseOut = () => {

        // Reset all blobs
        selectAll('.radar-area')
            .transition().duration(200)
            .style('fill-opacity', this.opacityArea)

    }

    render() {

        const {records, ui} = this.props

        const recordsData = filter(records.recordsWithCountryAndIndicatorData, {year: records.chartYear})

        if (recordsData.length === 0) return null

        let countries = []
        let indicators = [];

        for (let i = 0; i < recordsData.length; i++) {
            if (!find(countries, {'_id': recordsData[i].countryId})) {
                countries.push({
                    '_id': recordsData[i].countryId,
                    'name': recordsData[i].countryName,
                    'color': recordsData[i].countryColor
                })
            }
            if (!find(indicators, {'_id': recordsData[i].indicatorId})) {
                indicators.push({
                    '_id': recordsData[i].indicatorId,
                    'name': recordsData[i].indicatorName,
                    'color': recordsData[i].indicatorColor
                })
            }
        }

        if (size(recordsData) === 0) return null

        const length = ui.chartDimensions.width < ui.chartDimensions.height ? ui.chartDimensions.width : ui.chartDimensions.height,
            levels = 5, // How many levels or inner circles should there be drawn
            labelOffset = 55, // How much farther than the radius of the outer circle should the labels be placed
            strokeWidth = 3, // The width of the stroke around each blob
            maxValue = 100, // maxValue = max(recordsData, r => r.value), // value of the outermost circle
            radius = length / 2 - 100, // Radius of the outermost circle, save space for labels
            rScale = scaleLinear().range([0, radius]).domain([0, maxValue]) // Scale for the radius

        let allAxes = [],
            allSeries = [],
            seriesId = ''

        if (size(indicators) >= 3) {
            allAxes = indicators
            allSeries = countries
            seriesId = 'countryId'
        } else {
            allAxes = countries
            allSeries = indicators
            seriesId = 'indicatorId'
        }

        const totalAxes = size(allAxes), // The number of different axes
            totalSeries = size(allSeries), // The number of different series
            angleSlice = Math.PI * 2 / totalAxes // The width in radians of each "slice"

        if (totalAxes < 3) return null

        /////////////////////////////////////////////////////////
        /////////////// Draw the circular grid //////////////////
        /////////////////////////////////////////////////////////

        const levelsReverse = range(1, (levels + 1)).reverse()

        //Draw the background circles
        const circularGrid = []
        for (var i = 0; i < levelsReverse.length; i++) {
            circularGrid.push(
                <circle
                    key={i}
                    className='circular-grid'
                    r={radius / levels * levelsReverse[i]}
                    fill='#CDCDCD'
                    stroke='#CDCDCD'
                    fillOpacity={.1}
                />
            )
        }

        //Text indicating at what % each level is
        const tickText = []
        for (var i = 0; i < levelsReverse.length; i++) {
            tickText.push(
                <text
                    key={i}
                    className='circular-grid-text'
                    x={4}
                    y={-levelsReverse[i] * radius / levels}
                    fill='#737373'
                    fontSize={10}
                >
                    {levelsReverse[i] * 20}
                </text>
            )
        }

        /////////////////////////////////////////////////////////
        //////////////////// Draw the axes //////////////////////
        /////////////////////////////////////////////////////////

        const axes = []
        const axesLabels = []
        for (var i = 0; i < totalAxes; i++) {

            axes.push(
                <g
                    key={i}
                    className={'axis ' + allAxes[i].name}>
                    <line
                        className={'line'}
                        x1={0}
                        y1={0}
                        x2={rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)}
                        y2={rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)}
                        stroke={'white'}
                        strokeWidth={2}
                    />
                </g>
            )

            let axisRecords = []

            if (seriesId === 'countryId') {
                axisRecords = filter(recordsData, {'indicatorId': allAxes[i]._id})
            } else {
                axisRecords = filter(recordsData, {'countryId': allAxes[i]._id})
            }

            const content =
                <List>

                    <List.Header>
                        <div style={{color: allAxes[i].color}}>{allAxes[i].name + ' ' + recordsData[0].year}</div>
                        <Divider fitted/>
                    </List.Header>

                    {map(axisRecords, r => {

                        let fill = ''
                        let text = ''

                        if (seriesId === 'countryId') {
                            fill = r.countryColor
                            text = r.countryName
                        } else {
                            fill = r.indicatorColor
                            text = r.indicatorName
                        }

                        return (
                            <List.Item key={r.countryId + r.index + r.pillar + r.subpillar + r.year}>
                                <span style={{color: fill}}>{text}</span>&nbsp;&nbsp;&nbsp;{round(r.value, 2)}
                            </List.Item>
                        )

                    })}

                </List>

            const x = (rScale(maxValue) + labelOffset) * Math.cos(angleSlice * i - Math.PI / 2)
            let y = (rScale(maxValue) + labelOffset) * Math.sin(angleSlice * i - Math.PI / 2)

            let trigger = null
            if (ui.language === 'en') {
                let twoWordsArray = []
                let twoWordsString = ''
                forEach(allAxes[i].name.split(' '), word => {
                    if (twoWordsString === '') twoWordsString = word
                    else {
                        twoWordsArray.push(twoWordsString + ' ' + word)
                        twoWordsString = ''
                    }
                })
                if (twoWordsArray !== '') {
                    twoWordsArray.push(twoWordsString)
                }
                trigger =
                    <text
                        className={'axis-label-text ' + allAxes[i].name}
                        x={x}
                        y={y}
                        textAnchor='middle'
                        fontSize={14}
                    >
                        {map(twoWordsArray, (words, index) =>
                            <tspan
                                key={index}
                                dy={(index * 1.2 + .35) + 'em'}
                                x={x}
                                y={y}
                            >
                                {words}
                            </tspan>)}
                    </text>
            } else {
                trigger =
                    <foreignObject
                        className={'axis-label-text ' + allAxes[i].name}
                        x={x}
                        y={y - 15}
                        width={120}
                        height={100}
                        transform='translate(-60,0)'
                    >
                        <div
                            xmlns='http://www.w3.org/1999/xhtml'
                            style={{textAlign: 'center', paddingTop: 8}}
                        >
                            {allAxes[i].name}
                        </div>
                    </foreignObject>
            }

            axesLabels.push(
                <Popup
                    key={i}
                    style={{border: 'solid ' + allAxes[i].color + ' 1px'}}
                    flowing
                    hoverable
                    className='radar-chart-popup'
                    on='hover'
                    position='top center'
                    trigger={trigger}
                    content={content}
                />
            )
        }

        /////////////////////////////////////////////////////////
        ///////////// Draw the radar chart blobs ////////////////
        /////////////////////////////////////////////////////////

        const radarLine = radialLine()
            .curve(curveCardinalClosed.tension(.5))
            .radius(d => isNumber(d.value) ? rScale(d.value) : 0)
            .angle((d, i) => i * angleSlice)

        const blobs = []
        for (var i = 0; i < totalSeries; i++) {

            let seriesRecords = []

            forEach(allAxes, axis => {
                let record
                if (seriesId === 'countryId') {
                    record = find(recordsData, {countryId: allSeries[i]._id, indicatorId: axis._id})
                    if (record) {
                        seriesRecords.push(record)
                    } else {
                        seriesRecords.push({
                            indicatorId: axis._id,
                            index: axis.index,
                            pillar: axis.pillar,
                            subpillar: axis.subpillar,
                            indicatorColor: axis.color,
                            indicatorName: axis.name,
                            year: recordsData[0].year,
                            value: 'No Data Available'
                        })
                    }
                }
                else {
                    record = find(recordsData, {indicatorId: allSeries[i]._id, countryId: axis._id})
                    if (record) {
                        seriesRecords.push(record)
                    } else {
                        seriesRecords.push({
                            countryId: axis._id,
                            countryColor: axis.color,
                            countryName: axis.name,
                            year: recordsData[0].year,
                            value: 'No Data Available'
                        })
                    }
                }
            })

            const content =
                <List >

                    <List.Header>
                        <div style={{color: allSeries[i].color}}>{allSeries[i].name + ' ' + recordsData[0].year}</div>
                        <Divider fitted/>
                    </List.Header>

                    {map(seriesRecords, r => {

                        let fill = ''
                        let text = ''

                        if (seriesId === 'countryId') {
                            fill = r.indicatorColor
                            text = r.indicatorName
                        } else {
                            fill = r.countryColor
                            text = r.countryName
                        }

                        return (
                            <List.Item
                                key={r.countryId + r.indicatorId + r.index + r.pillar + r.subpillar + r.year}
                                disabled={!isNumber(r.value)}
                            >
                                <span style={isNumber(r.value) ? {color: fill} : {}}>{text}</span>&nbsp;&nbsp;&nbsp;
                                {isNumber(r.value) ? round(r.value, 2) : <TAP translate='no_data_available'/>}
                            </List.Item>
                        )

                    })}

                </List>

            const trigger =
                <g
                    className={'radar-wrapper ' + allSeries[i].name}>
                    <path
                        className='radar-area'
                        d={radarLine(seriesRecords)}
                        fill={allSeries[i].color}
                        fillOpacity={this.opacityArea}
                        onMouseOver={this._blobOnMouseOver}
                        onMouseOut={this._blobOnMouseOut}
                    />
                    <path
                        className='radar-stroke'
                        d={radarLine(seriesRecords)}
                        strokeWidth={strokeWidth}
                        stroke={allSeries[i].color}
                        fill={'none'}
                    />
                </g>

            blobs.push(
                <Popup
                    key={i}
                    style={{border: 'solid ' + allSeries[i].color + ' 1px'}}
                    flowing
                    hoverable
                    className='radar-chart-popup'
                    on='hover'
                    position='top center'
                    trigger={trigger}
                    content={content}
                />
            )
        }

        if (size(blobs) === 0) return null

        let mainTransform = 'translate(' + (ui.chartDimensions.width / 2) + ',' + ((ui.chartDimensions.height / 2 - 8) + 48) + ')' // -8 to raise the chart a bit, +48 to make room for title

        return (
            <g transform={mainTransform}>
                {circularGrid}
                {axes}
                {tickText}
                {blobs}
                {axesLabels}
            </g>
        )

    }

}