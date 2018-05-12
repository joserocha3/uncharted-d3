/*-------------------------------------------------------------------------*
 * Object name:   IndicatorsSearch.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Search type dropdown to find populate chart indicator sidebar
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #33.3  07/01/2017  Pablo Rocha  - Filter by chartIndexType
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Search} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {map, filter, escapeRegExp, reduce} from 'lodash'

@inject('indicators', 'records', 'ui') @observer
export default class IndicatorsSearch extends React.Component {

    state = {value: '', results: {}, source: []}

    _handleResultSelect = (e, result) => {

        const {indicators, records, ui} = this.props

        const indicator = indicators.data.find(i => i._id === result.key)

        if (indicators.chartIndexType !== indicator.indexType) return

        indicators.toggleActive(result.key)

        switch (result._id.charAt(0)) {
            case 'I':
                records.setIndexIdsToFind(indicators.activeIndexIds)
                break
            case 'P':
                records.setPillarIdsToFind(indicators.activePillarIds)
                break
            case 'S':
                records.setSubpillarIdsToFind(indicators.activeSubpillarIds)
                break
        }

        records.updateRecordsDataForChart()
        ui.setDisabled()

        this.setState({value: ''})

    }

    _handleSearchChange = (e, value) => {

        const {indicators, ui} = this.props

        this.setState({
            isLoading: true,
            value
        })

        const indexes = map(filter(indicators.data, {type: 'index', indexType: indicators.chartIndexType}), index => ({key: index._id, ...index}))
        const pillars = map(filter(indicators.data, {type: 'pillar', indexType: indicators.chartIndexType}), pillar => ({key: pillar._id, ...pillar}))
        const subpillars = map(filter(indicators.data, {type: 'subpillar', indexType: indicators.chartIndexType}), subpillar => ({key: subpillar._id, ...subpillar}))

        const source = {
            index: {name: 'Indexes', results: indexes},
            pillar: {name: 'Pillars', results: pillars},
            subpillar: {name: 'Subpillars', results: subpillars}
        }

        const re = new RegExp(escapeRegExp(value), 'i')
        const isMatch = result => re.test(ui.language === 'en' ? result.nameEn : result.nameAr)

        const filteredResults = reduce(source, (category, data, name) => {

            const results = filter(data.results, isMatch)

            if (results.length) {
                category[name] = {name: data.name, results}
            }

            return category

        }, {})

        this.setState({isLoading: false, results: filteredResults,})

    }

    render() {

        const {ui} = this.props
        const {results, value} = this.state

        return (
            <Search
                fluid
                category
                onResultSelect={this._handleResultSelect}
                onSearchChange={this._handleSearchChange}
                results={results}
                value={value}
                categoryRenderer={data => <span>{data.name}</span>}
                resultRenderer={data => <span className={data.active ? 'active-selected' : null}>{ui.language === 'en' ? data.nameEn : data.nameAr}</span>}
            />
        )

    }

}