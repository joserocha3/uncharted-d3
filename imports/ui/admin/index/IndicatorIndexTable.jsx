/*-------------------------------------------------------------------------*
 * Object name:   IndicatorIndexTable.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render index records
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Add color column
 * master         07/09/2017  Pablo Rocha  - Add 2015 column
 *                                         - Set colorPickerValue on click
 * master  #22.1  07/14/2017  Pablo Rocha  - Remove profileIcon TODO: replace with colorIcon and whiteIcon
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Icon, Table} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {forEach, find, filter, concat, uniq, map, orderBy} from 'lodash'

// Components
import TableHeaderCell from '../../common/TableHeaderCell'

@inject('indicators', 'ui') @observer
export default class IndicatorIndexTable extends React.Component {

    _handleOnClick = indicator => {
        const {indicators, ui} = this.props
        indicators.setUpdateIndex(indicator)
        ui.setActiveAdminModal('indicatorIndexNew')
        ui.setColorPickerValue(indicator.color)
    }

    componentWillMount() {
        const {ui} = this.props
        ui.setTableSortedAscendingColumn('nameEn')
        ui.setTableSortedDescendingColumn('')
    }

    render() {

        const {indicators, ui} = this.props

        let indexData = []

        forEach(indicators.indexIdsToDisplay, id => {
            const index = find(indicators.data.slice(), {_id: id})
            if (index) indexData.push(index)
        })

        forEach(indicators.indexTypesToDisplay, indexType => {
            const indexes = filter(indicators.data.slice(), {indexType: indexType})
            indexData = concat(indexes, indexData)
        })

        indexData = uniq(indexData)

        const header =
            <Table.Header>
                <Table.Row>
                    {ui.showIdColumn ? <TableHeaderCell column='_id' name='ID'/> : null}
                    <TableHeaderCell column='nameEn' name='Name EN'/>
                    <TableHeaderCell column='nameAr' name='Name AR'/>
                    <TableHeaderCell column='color' name='Color'/>
                    <TableHeaderCell column='indexType' name='Index Type'/>
                    <TableHeaderCell column='sortOrder' name='Sort Order'/>
                    <TableHeaderCell column='is2015' name='2015'/>
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdAt' name='Created At'/> : null}
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdBy' name='Created By'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedAt' name='Changed At'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedBy' name='Changed By'/> : null}
                    {ui.showDeleteColumn ? <TableHeaderCell column='delete' name='Delete'/> : null}
                </Table.Row>
            </Table.Header>

        const body =
            <Table.Body>
                {map(orderBy(indexData, [ui.tableSortedAscendingColumn, ui.tableSortedDescendingColumn], ['asc', 'desc']), index =>
                    <Table.Row key={index._id} onClick={(event, data) => this._handleOnClick(index)}>
                        {ui.showIdColumn ? <Table.Cell>{index._id}</Table.Cell> : null}
                        <Table.Cell>{index.nameEn}</Table.Cell>
                        <Table.Cell>{index.nameAr}</Table.Cell>
                        <Table.Cell style={{backgroundColor: index.color}}>{index.color}</Table.Cell>
                        <Table.Cell>{index.indexType}</Table.Cell>
                        <Table.Cell>{index.sortOrder}</Table.Cell>
                        <Table.Cell textAlign='center'>{index.is2015 ? <Icon size='large' name='check' color='green'/> : null}</Table.Cell>
                        {ui.showCreatedColumns ? <Table.Cell>{index.createdAt}</Table.Cell> : null}
                        {ui.showCreatedColumns ? <Table.Cell>{index.createdBy}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{index.changedAt}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{index.changedBy}</Table.Cell> : null}
                        {ui.showDeleteColumn ? <Table.Cell>{index.delete}</Table.Cell> : null}
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