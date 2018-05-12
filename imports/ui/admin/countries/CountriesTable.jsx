import React from 'react'
import {Icon, Image, Menu, Table} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {forEach, find, map, orderBy} from 'lodash'

import TableHeaderCell from '../../common/TableHeaderCell'

@inject('countries', 'ui') @observer
export default class CountriesTable extends React.Component {

    _handleOnClick = country => {
        const {countries, ui} = this.props
        countries.setUpdateCountry(country, 'allFields')
        ui.setColorPickerValue(country.color)
        ui.setActiveAdminModal('countriesUpdate')
    }

    componentWillMount() {
        const {ui} = this.props
        ui.setTableSortedAscendingColumn('nameEn')
        ui.setTableSortedDescendingColumn('')
    }

    render() {

        const {countries, ui} = this.props

        const countryData = []

        forEach(countries.countryIdsToDisplay, id => {
            const country = find(countries.data, country => country._id === id)
            if (country) countryData.push(country)
        })

        const header =
            <Table.Header>
                <Table.Row>
                    {ui.showIdColumn ? <TableHeaderCell column='_id' name='ID'/> : null}
                    <TableHeaderCell column='nameEn' name='Name EN'/>
                    <TableHeaderCell column='nameAr' name='Name AR'/>
                    <TableHeaderCell column='iso' name='ISO'/>
                    <TableHeaderCell column='flag' name='Flag'/>
                    <TableHeaderCell column='color' name='Color'/>
                    <TableHeaderCell column='profileHeader' name='Profile Header'/>
                    <TableHeaderCell column='profileMap' name='Profile Map'/>
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdAt' name='Created At'/> : null}
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdBy' name='Created By'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedAt' name='Changed At'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedBy' name='Changed By'/> : null}
                    {ui.showDeleteColumn ? <TableHeaderCell column='delete' name='Delete'/> : null}
                </Table.Row>
            </Table.Header>

        const body =
            <Table.Body>
                {map(orderBy(countryData, [ui.tableSortedAscendingColumn, ui.tableSortedDescendingColumn], ['asc', 'desc']), country =>
                    <Table.Row key={country._id} onClick={(event, data) => this._handleOnClick(country)}>
                        {ui.showIdColumn ? <Table.Cell>{country._id}</Table.Cell> : null}
                        <Table.Cell>{country.nameEn}</Table.Cell>
                        <Table.Cell>{country.nameAr}</Table.Cell>
                        <Table.Cell>{country.iso}</Table.Cell>
                        <Table.Cell><Image src={country.flag} size='mini' alt={country.flag}/></Table.Cell>
                        <Table.Cell style={{backgroundColor: country.color}}>{country.color}</Table.Cell>
                        <Table.Cell><Image src={country.profileHeader} size='mini' alt={country.profileHeader}/></Table.Cell>
                        <Table.Cell><Image src={country.profileMap} size='mini' alt={country.profileMap}/></Table.Cell>
                        {ui.showCreatedColumns ? <Table.Cell>{country.createdAt}</Table.Cell> : null}
                        {ui.showCreatedColumns ? <Table.Cell>{country.createdBy}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{country.changedAt}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{country.changedBy}</Table.Cell> : null}
                        {ui.showDeleteColumn ? <Table.Cell>{country.delete}</Table.Cell> : null}
                    </Table.Row>
                )}
            </Table.Body>

        // const footer =
        //     <Table.Footer>
        //         <Table.Row>
        //             <Table.HeaderCell colSpan='11'>
        //                 <Menu floated='right' pagination>
        //                     <Menu.Item as='a' icon> <Icon name='left chevron'/> </Menu.Item>
        //                     <Menu.Item as='a'>1</Menu.Item>
        //                     <Menu.Item as='a'>2</Menu.Item>
        //                     <Menu.Item as='a'>3</Menu.Item>
        //                     <Menu.Item as='a'>4</Menu.Item>
        //                     <Menu.Item as='a' icon> <Icon name='right chevron'/></Menu.Item>
        //                 </Menu>
        //             </Table.HeaderCell>
        //         </Table.Row>
        //     </Table.Footer>

        return (
            <Table celled attached selectable sortable>
                {header}
                {body}
            </Table>
        )

    }

}