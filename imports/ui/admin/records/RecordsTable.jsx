import React from 'react'
import {Table} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {map, find, orderBy} from 'lodash'

import TableHeaderCell from '../../common/TableHeaderCell'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class RecordsTable extends React.Component {

    _handleOnClick = record => {
        const {records, ui} = this.props
        records.setUpdateRecord(record, true)
        ui.setActiveAdminModal('recordsNew')
    }

    componentWillMount() {
        const {ui} = this.props
        ui.setTableSortedAscendingColumn('country')
        ui.setTableSortedDescendingColumn('')
    }

    render() {

        const {countries, indicators, records, ui} = this.props

        const recordsData = map(records.data.slice(), record => {
            const data = {...record}
            data.countryNameEn = find(countries.data, {_id: data.country}).nameEn
            data.indexNameEn = find(indicators.data, {_id: data.index}).nameEn
            data.pillarNameEn = data.pillar ? find(indicators.data, {_id: data.pillar}).nameEn : null
            data.subpillarNameEn = data.subpillar ? find(indicators.data, {_id: data.subpillar}).nameEn : null
            return data
        })

        const header =
            <Table.Header>
                <Table.Row>
                    {ui.showIdColumn ? <TableHeaderCell column='_id' name='ID'/> : null}
                    <TableHeaderCell column='country' name='Country'/>
                    <TableHeaderCell column='index' name='Index'/>
                    <TableHeaderCell column='pillar' name='Pillar'/>
                    <TableHeaderCell column='subpillar' name='Subpillar'/>
                    <TableHeaderCell column='year' name='Year'/>
                    <TableHeaderCell column='value' name='Value'/>
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdAt' name='Created At'/> : null}
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdBy' name='Created By'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedAt' name='Changed At'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedBy' name='Changed By'/> : null}
                    {ui.showDeleteColumn ? <TableHeaderCell column='delete' name='Delete'/> : null}
                </Table.Row>
            </Table.Header>

        const body =
            <Table.Body>
                {map(orderBy(recordsData, [ui.tableSortedAscendingColumn, ui.tableSortedDescendingColumn], ['asc', 'desc']), record =>
                    <Table.Row key={record._id + record.year} onClick={(event, data) => this._handleOnClick(record)}>
                        {ui.showIdColumn ? <Table.Cell>{record._id}</Table.Cell> : null}
                        <Table.Cell>{record.countryNameEn}</Table.Cell>
                        <Table.Cell>{record.indexNameEn}</Table.Cell>
                        <Table.Cell>{record.pillarNameEn}</Table.Cell>
                        <Table.Cell>{record.subpillarNameEn}</Table.Cell>
                        <Table.Cell>{record.year}</Table.Cell>
                        <Table.Cell>{record.value}</Table.Cell>
                        {ui.showCreatedColumns ? <Table.Cell>{record.createdAt}</Table.Cell> : null}
                        {ui.showCreatedColumns ? <Table.Cell>{record.createdBy}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{record.changedAt}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{record.changedBy}</Table.Cell> : null}
                        {ui.showDeleteColumn ? <Table.Cell>{record.delete}</Table.Cell> : null}
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