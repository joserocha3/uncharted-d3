/*-------------------------------------------------------------------------*
 * Object name:   IndicatorPillarTable.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render pillar records
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
import {forEach, filter, find, concat, uniq, map, orderBy} from 'lodash'

// Components
import TableHeaderCell from '../../common/TableHeaderCell'

@inject('indicators', 'ui') @observer
export default class IndicatorPillarTable extends React.Component {

    _handleOnClick = pillar => {
        const {indicators, ui} = this.props
        indicators.setUpdatePillar(pillar)
        ui.setActiveAdminModal('indicatorPillarNew')
        ui.setColorPickerValue(pillar.color)
    }

    componentWillMount() {
        const {ui} = this.props
        ui.setTableSortedAscendingColumn('nameEn')
        ui.setTableSortedDescendingColumn('')
    }

    render() {

        const {indicators, ui} = this.props

        let pillarData = []

        forEach(indicators.indexIdsToDisplay, _id => {
            const pillars = filter(filter(indicators.data.slice(), {type: 'pillar'}), {index: _id})
            pillarData = concat(pillars, pillarData)
        })

        forEach(indicators.pillarIdsToDisplay, _id => {
            const pillar = find(filter(indicators.data.slice(), {type: 'pillar'}), {_id: _id})
            if (pillar) pillarData.push(pillar)
        })

        pillarData = uniq(pillarData)

        const header =
            <Table.Header>
                <Table.Row>
                    {ui.showIdColumn ? <TableHeaderCell column='_id' name='ID'/> : null}
                    <TableHeaderCell column='indexNameEn' name='Index'/>
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
                {map(orderBy(pillarData, [ui.tableSortedAscendingColumn, ui.tableSortedDescendingColumn], ['asc', 'desc']), pillar =>
                    <Table.Row key={pillar._id} onClick={(event, data) => this._handleOnClick(pillar)}>
                        {ui.showIdColumn ? <Table.Cell>{pillar._id}</Table.Cell> : null}
                        <Table.Cell>{pillar.indexNameEn}</Table.Cell>
                        <Table.Cell>{pillar.nameEn}</Table.Cell>
                        <Table.Cell>{pillar.nameAr}</Table.Cell>
                        <Table.Cell style={{backgroundColor: pillar.color}}>{pillar.color}</Table.Cell>
                        <Table.Cell textAlign='center'>{pillar.is2015 ? <Icon size='large' name='check' color='green'/> : null}</Table.Cell>
                        {ui.showCreatedColumns ? <Table.Cell>{pillar.createdAt}</Table.Cell> : null}
                        {ui.showCreatedColumns ? <Table.Cell>{pillar.createdBy}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{pillar.changedAt}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{pillar.changedBy}</Table.Cell> : null}
                        {ui.showDeleteColumn ? <Table.Cell>{pillar.delete}</Table.Cell> : null}
                    </Table.Row>
                )}
            </Table.Body>

        // const footer =
        //     <Table.Footer>
        //         <Table.Row>
        //             <Table.HeaderCell colSpan='9'>
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