/*-------------------------------------------------------------------------*
 * Object name:   BarChart.jsx
 * Created by:    Pablo Rocha
 * Creation date: 01/01/2017
 * Description:   Component displayed when bar chart is selected
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #13    06/09/2017  Pablo Rocha  - Call recordsIncludingMissingData instead of recordsWithCountryAndIndicatorData
 *                                         - Handle Bars with a null record value, we display now with zero height
 *                                         - Removed some lodash dependencies
 * master  #16.1  06/09/2017  Pablo Rocha  - Add ui.groupToggle functionality
 * master  #16.2  06/12/2017  Pablo Rocha  - Make countryGroups, scale and labels assignment more specific
 * master  #26.1  06/13/2017  Pablo Rocha  - Do not pass axis labels to Axis components
 *                                         - Reduce margins since we do not have axis labels anymore
 * master  #27.1  06/13/2017  Pablo Rocha  - Add innerPadding to x1 scale
 * master  #15.1  06/14/2017  Pablo Rocha  - Pass chart prop to Axis
 * master  #15.5  06/16/2017  Pablo Rocha  - Remove chart prop from Axis and use scaleType instead
 * master  #15.6  06/16/2017  Pablo Rocha  - Correct modification history
 * master  #10.1  06/17/2017  Pablo Rocha  - Increase margin for larger font sizes
 * master  #19.3  06/19/2017  Pablo Rocha  - Adjust margins for no more subtitle
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import {Divider, List} from 'semantic-ui-react'
import {scaleLinear, scaleBand} from 'd3'
import {keys, groupBy, forOwn, round} from 'lodash'

// Components
import Bar from '../common/Bar'
import Grid from '../common/Grid'
import Axis from '../common/Axis'
import TAP from '../common/TAP'
import CustomPopup from '../common/CustomPopup'


@inject('countries', 'indicators', 'records', 'ui') @observer
export default class BarChart extends React.Component {

    _barClick = data => {

        const {indicators, records} = this.props

        let indexIds = []
        let pillarIds = []
        let subpillarIds = []

        switch (data.indicatorId.charAt(0)) {
            case 'I': // index, set pillars
                pillarIds = indicators._getPillarIdsForIndexId(data.indicatorId)
                if (pillarIds.length === 0) return
                break
            case 'P': // pillar, set subpillars
                subpillarIds = indicators._getSubpillarIdsForPillarId(data.indicatorId)
                if (subpillarIds.length === 0) return
                break
            case 'S': // subpillar, back to indexes
                indexIds = indicators._getIndexIds(data.indicatorId)
                break
            default:
                return
        }

        records.setProfileIndexes(indexIds)
        records.setProfilePillars(pillarIds)
        records.setProfileSubpillars(subpillarIds)

        records.updateRecordsDataForProfile()

    }

    render() {

        const {countries, indicators, profile, records, ui} = this.props

        const recordsData = profile ? records.recordsWithCountryAndIndicatorData : records.recordsIncludingMissingData
        const countryIds = keys(groupBy(recordsData, 'countryId'))
        const indicatorIds = keys(groupBy(recordsData, 'indicatorId'))
        const countryNames = keys(groupBy(recordsData, 'countryName'))
        const indicatorNames = keys(groupBy(recordsData, 'indicatorName'))

        if (recordsData.length === 0) return null

        const margin = {top: ui.activeNavigationMenuItem === 'chart' ? 70 : 10, right: 15, bottom: 90, left: 50}
        const width = ui.chartDimensions.width - margin.left - margin.right
        const height = ui.chartDimensions.height - margin.bottom - margin.top

        let countryGroups
        if (profile || countries.activeIds.length === 1 && indicators.activeIds.length > 1) {
            countryGroups = true
        } else if (indicators.activeIds.length === 1 && countries.activeIds.length > 1) {
            countryGroups = false
        } else {
            countryGroups = ui.groupToggle === 'country'
        }

        const y = scaleLinear()
            .domain([0, 100])
            .range([height, 0])

        const x0 = scaleBand() // scale to divide groups
            .domain(countryGroups ? countryIds : indicatorIds)
            .range([0, width])
            .paddingInner(profile || (countries.activeIds.length === 1 || indicators.activeIds.length === 1) ? 0 : .1)

        const x1 = scaleBand() // scale to divide grouped bars
            .domain(countryGroups ? indicatorIds : countryIds)
            .range([0, x0.bandwidth()])
            .paddingInner(.04)

        const groups = []
        const groupData = countryGroups ? groupBy(recordsData, 'countryId') : groupBy(recordsData, 'indicatorId')

        forOwn(groupData, d => {

            // Setup the background rect that gets tinted on hover over the general area for this group

            const colorRect =
                <rect
                    className='group-area'
                    fill='#ABABAB'
                    height={height}
                    width={x0.bandwidth()}
                    x={0}
                    y={0}
                    fillOpacity={0}
                />

            // Setup the bars for each individual country/indicator

            const bars = d.map((d2, index) => {
                return (
                    <Bar
                        key={index}
                        height={height - y(d2.value)}
                        width={x1.bandwidth()}
                        x={x1(countryGroups ? d2.indicatorId : d2.countryId)}
                        y={y(d2.value)}
                        fill={countryGroups ? d2.indicatorColor : d2.countryColor}
                        onClick={profile ? () => this._barClick(d2) : null}
                        style={profile ? {cursor: 'pointer'} : {}}
                        header={
                            <List.Header>
                                <span style={{color: countryGroups ? d2.indicatorColor : d2.countryColor}}>{countryGroups ? d2.indicatorName : d2.countryName + ' ' + d2.year}</span>
                            </List.Header>
                        }
                        items={
                            <List.Item
                                onClick={profile ? () => this._barClick(d2) : null}
                                style={profile ? {cursor: 'pointer'} : {}}
                                disabled={d2.value === null}
                            >
                                <span style={d2.value === null ? {} : {color: countryGroups ? d2.countryColor : d2.indicatorColor}}>{countryGroups ? d2.countryName : d2.indicatorName}</span>
                                &nbsp;&nbsp;&nbsp;{d2.value === null ? <TAP translate='no_data_available'/> : round(d2.value, 2)}
                            </List.Item>
                        }
                    />
                )
            })

            // Setup the rect that triggers colorRect to be tinted

            const hoverRect =
                <rect
                    onMouseOver={e => e.target.parentNode.getElementsByClassName('group-area')[0].setAttribute('fill-opacity', '0.1')}
                    onMouseOut={e => e.target.parentNode.getElementsByClassName('group-area')[0].setAttribute('fill-opacity', '0')}
                    fillOpacity={0}
                    height={height}
                    width={x0.bandwidth()}
                    x={0}
                    y={0}
                />

            // List of all countries/indicators for this group that shows on hoverRect hover

            const list =
                <List>
                    <List.Header>
                        <span style={{color: countryGroups ? d[0].countryColor : d[0].indicatorColor}}>{(countryGroups ? d[0].countryName : d[0].indicatorName)} {d[0].year}</span>
                    </List.Header>
                    <Divider fitted/>
                    {d.map((d2, index) => {
                        const name = countryGroups ? d2.indicatorName : d2.countryName
                        return (
                            <List.Item
                                key={index}
                                onClick={profile ? () => this._barClick(d2) : null}
                                style={profile ? {cursor: 'pointer'} : {}}
                                disabled={d2.value === null}
                            >
                                <span style={d2.value === null ? {} : {color: countryGroups ? d2.indicatorColor : d2.countryColor}}>{name}</span>
                                &nbsp;&nbsp;&nbsp;{d2.value === null ? <TAP translate='no_data_available'/> : round(d2.value, 2)}
                            </List.Item>
                        )
                    })}
                </List>

            const popup =
                <CustomPopup
                    style={{border: 'solid ' + (countryGroups ? d[0].countryColor : d[0].indicatorColor) + ' 1px'}}
                    basic
                    flowing
                    hoverable
                    hideOnScroll
                    className='bar-chart-popup'
                    on='hover'
                    position='top center'
                    trigger={hoverRect}
                    children={list}>
                </CustomPopup>

            groups.push(
                <g
                    key={countryGroups ? d[0].countryId : d[0].indicatorId}
                    className='group'
                    transform={'translate(' + x0(countryGroups ? d[0].countryId : d[0].indicatorId) + ',0)'}>
                    {colorRect}
                    {popup}
                    {bars}
                </g>
            )

        })

        const mainTransform = 'translate(' + margin.left + ',' + margin.top + ')'
        const yearsTransform = 'scale(1,-1) translate(0,' + -height + ')' // mirror it on x axis

        let scale, tickValues

        if (!profile && groups.length > 1 && ui.groupToggle === 'country') {

            scale = x0
            tickValues = countryNames

        } else if (profile || (countries.activeIds.length === 1 && indicators.activeIds.length > 1)) {

            scale = countryGroups ? x1 : x0
            tickValues = countryGroups ? indicatorNames : countryNames

        } else if (countries.activeIds.length > 1 && indicators.activeIds.length === 1) {

            scale = countryGroups ? x0 : x1
            tickValues = countryGroups ? indicatorNames : countryNames

        } else {

            scale = countryGroups ? x1 : x0
            tickValues = countryGroups ? countryNames : indicatorNames

        }

        return (
            <g transform={mainTransform}>

                <Grid height={height} width={width} scale={y} gridType='horizontal'/>

                <Axis height={height} width={width} margin={margin} scale={scale} scaleType='group' axisType='x' tickValues={tickValues}/>
                <Axis height={height} width={width} margin={margin} scale={y} axisType='y'/>

                <g className='groups' transform={yearsTransform}>
                    {groups}
                </g>

            </g>
        )

    }

}