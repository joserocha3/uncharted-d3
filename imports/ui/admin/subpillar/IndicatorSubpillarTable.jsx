/*-------------------------------------------------------------------------*
 * Object name:   IndicatorSubpillarTable.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render subpillar records
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Add color column
 * master         07/09/2017  Pablo Rocha  - Add 2015 column
 *                                         - Set colorPickerValue on click
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Icon, Table} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {forEach, filter, concat, find, uniq, map, orderBy} from 'lodash'

// Components
import TableHeaderCell from '../../common/TableHeaderCell'

@inject('indicators', 'ui') @observer
export default class IndicatorSubpillarTable extends React.Component {

    _handleOnClick = subpillar => {
        const {indicators, ui} = this.props
        indicators.setUpdateSubpillar(subpillar)
        ui.setActiveAdminModal('indicatorSubpillarNew')
        ui.setColorPickerValue(subpillar.color)
    }

    componentWillMount() {
        const {ui} = this.props
        ui.setTableSortedAscendingColumn('nameEn')
        ui.setTableSortedDescendingColumn('')
    }

    render() {

        const {indicators, ui} = this.props

        let subpillarData = []

        forEach(indicators.indexIdsToDisplay, _id => {
            const subpillars = filter(filter(indicators.data.slice(), {type: 'subpillar'}), {index: _id})
            subpillarData = concat(subpillars, subpillarData)
        })

        forEach(indicators.pillarIdsToDisplay, _id => {
            const subpillars = filter(filter(indicators.data.slice(), {type: 'subpillar'}), {pillar: _id})
            subpillarData = concat(subpillars, subpillarData)
        })

        forEach(indicators.subpillarIdsToDisplay, _id => {
            const subpillar = find(filter(indicators.data.slice(), {type: 'subpillar'}), {_id: _id})
            if (subpillar) subpillarData.push(subpillar)
        })

        subpillarData = uniq(subpillarData)

        const header =
            <Table.Header>
                <Table.Row>
                    {ui.showIdColumn ? <TableHeaderCell column='_id' name='ID'/> : null}
                    <TableHeaderCell column='indexNameEn' name='Index'/>
                    <TableHeaderCell column='pillarNameEn' name='Pillar'/>
                    <TableHeaderCell column='nameEn' name='Name EN'/>
                    <TableHeaderCell column='nameAr' name='Name AR'/>
                    <TableHeaderCell column='color' name='Color'/>
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
                {map(orderBy(subpillarData, [ui.tableSortedAscendingColumn, ui.tableSortedDescendingColumn], ['asc', 'desc']), subpillar =>
                    <Table.Row key={subpillar._id} onClick={(event, data) => this._handleOnClick(subpillar)}>
                        {ui.showIdColumn ? <Table.Cell>{subpillar._id}</Table.Cell> : null}
                        <Table.Cell>{subpillar.indexNameEn}</Table.Cell>
                        <Table.Cell>{subpillar.pillarNameEn}</Table.Cell>
                        <Table.Cell>{subpillar.nameEn}</Table.Cell>
                        <Table.Cell>{subpillar.nameAr}</Table.Cell>
                        <Table.Cell style={{backgroundColor: subpillar.color}}>{subpillar.color}</Table.Cell>
                        <Table.Cell textAlign='center'>{subpillar.is2015 ? <Icon size='large' name='check' color='green'/> : null}</Table.Cell>
                        {ui.showCreatedColumns ? <Table.Cell>{subpillar.createdAt}</Table.Cell> : null}
                        {ui.showCreatedColumns ? <Table.Cell>{subpillar.createdBy}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{subpillar.changedAt}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{subpillar.changedBy}</Table.Cell> : null}
                        {ui.showDeleteColumn ? <Table.Cell>{subpillar.delete}</Table.Cell> : null}
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