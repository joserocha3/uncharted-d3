import React from 'react'
import {Table} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {forEach, find, map, orderBy} from 'lodash'

import TableHeaderCell from '../../common/TableHeaderCell'

@inject('countries', 'ui') @observer
export default class CountryProfileTable extends React.Component {

    _handleOnClick = (_id, profile) => {
        const {countries, ui} = this.props
        countries.setUpdateCountryProfile(_id, profile, true)
        ui.setActiveAdminModal('countryProfileNew')
    }

    componentWillMount() {
        const {ui} = this.props
        ui.setTableSortedAscendingColumn('nameEn')
        ui.setTableSortedDescendingColumn('')
    }

    render() {

        const {countries, ui} = this.props

        const profiles = []

        forEach(countries.countryIdsToDisplay, id => {
            const country = find(countries.data, country => country._id === id)
            forEach(country.profiles, profile => {
                profile.countryId = country._id
                profile.countryName = country.nameEn
                profiles.push(profile)
            })
        })

        const header =
            <Table.Header>
                <Table.Row>
                    {ui.showIdColumn ? <TableHeaderCell column='_id' name='ID'/> : null}
                    <TableHeaderCell column='nameEn' name='Name EN'/>
                    <TableHeaderCell column='year' name='Year'/>
                    <TableHeaderCell column='area' name='Area'/>
                    <TableHeaderCell column='totalPopulation' name='Total Population'/>
                    <TableHeaderCell column='populationGrowthRate' name='Population Growth Rate'/>
                    <TableHeaderCell column='gdp' name='GDP'/>
                    <TableHeaderCell column='gdpPerCapita' name='GDP per capita'/>
                    <TableHeaderCell column='gdpGrowthRate' name='GDP Growth Rate'/>
                    <TableHeaderCell column='percentageOfYouth' name='Percentage of Youth (15-24 years)'/>
                    <TableHeaderCell column='youthLiteracyRate' name='Youth Literacy Rate (15-24 years)'/>
                    <TableHeaderCell column='youthUnemploymentRate' name='Youth Unemployment Rate (15-24 years)'/>
                    <TableHeaderCell column='lifeExpectancyAtBirth' name='Life Expectancy at Birth'/>
                    <TableHeaderCell column='overview' name='Overview EN'/>
                    <TableHeaderCell column='ar_overview' name='Overview AR'/>
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdAt' name='Created At'/> : null}
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdBy' name='Created By'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedAt' name='Changed At'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedBy' name='Changed By'/> : null}
                    {ui.showDeleteColumn ? <TableHeaderCell column='delete' name='Delete'/> : null}
                </Table.Row>
            </Table.Header>

        const body =
            <Table.Body>
                {map(orderBy(profiles, [ui.tableSortedAscendingColumn, ui.tableSortedDescendingColumn], ['asc', 'desc']), profile =>
                    <Table.Row key={profile.countryId + profile.year} onClick={(event, data) => this._handleOnClick(profile.countryId, profile)}>
                        {ui.showIdColumn ? <Table.Cell>{profile.countryId}</Table.Cell> : null}
                        <Table.Cell>{profile.countryName}</Table.Cell>
                        <Table.Cell>{profile.year}</Table.Cell>
                        <Table.Cell>{profile.area}</Table.Cell>
                        <Table.Cell>{profile.totalPopulation}</Table.Cell>
                        <Table.Cell>{profile.populationGrowthRate}</Table.Cell>
                        <Table.Cell>{profile.gdp}</Table.Cell>
                        <Table.Cell>{profile.gdpPerCapita}</Table.Cell>
                        <Table.Cell>{profile.gdpGrowthRate}</Table.Cell>
                        <Table.Cell>{profile.percentageOfYouth}</Table.Cell>
                        <Table.Cell>{profile.youthLiteracyRate}</Table.Cell>
                        <Table.Cell>{profile.youthUnemploymentRate}</Table.Cell>
                        <Table.Cell>{profile.lifeExpectancyAtBirth}</Table.Cell>
                        <Table.Cell>Click to view</Table.Cell>
                        <Table.Cell>Click to view</Table.Cell>
                        {ui.showCreatedColumns ? <Table.Cell>{profile.createdAt}</Table.Cell> : null}
                        {ui.showCreatedColumns ? <Table.Cell>{profile.createdBy}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{profile.changedAt}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{profile.changedBy}</Table.Cell> : null}
                        {ui.showDeleteColumn ? <Table.Cell>{profile.delete}</Table.Cell> : null}
                    </Table.Row>
                )}
            </Table.Body>

        return (
            <Table celled attached selectable sortable>
                {header}
                {body}
            </Table>
        )

    }

}