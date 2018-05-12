import React from 'react'
import {Icon, Table} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {orderBy} from 'lodash'

import TableHeaderCell from '../../common/TableHeaderCell'

@inject('ui', 'users') @observer
export default class UsersTable extends React.Component {

    _handleOnClick = user => {
        const {users, ui} = this.props
        users.setUpdateUser(user)
        ui.setActiveAdminModal('usersNew')
    }

    componentWillMount() {
        const {ui} = this.props
        ui.setTableSortedAscendingColumn('username')
        ui.setTableSortedDescendingColumn('')
    }

    render() {

        const {ui, users} = this.props

        const header =
            <Table.Header>
                <Table.Row>
                    {ui.showIdColumn ? <TableHeaderCell column='_id' name='ID'/> : null}
                    <TableHeaderCell column='username' name='Username'/>
                    <TableHeaderCell column='firstName' name='First Name'/>
                    <TableHeaderCell column='lastName' name='Last Name'/>
                    <TableHeaderCell column='company' name='Company'/>
                    <TableHeaderCell column='email' name='Email'/>
                    <TableHeaderCell column='loggedIn' name='Logged In'/>
                    <TableHeaderCell column='accountLocked' name='Account Locked'/>
                    <TableHeaderCell column='lastLogin' name='Last Login'/>
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdAt' name='Created At'/> : null}
                    {ui.showCreatedColumns ? <TableHeaderCell column='createdBy' name='Created By'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedAt' name='Changed At'/> : null}
                    {ui.showChangedColumns ? <TableHeaderCell column='changedBy' name='Changed By'/> : null}
                </Table.Row>
            </Table.Header>

        const body =
            <Table.Body>
                {orderBy(users.adminSelectedData.slice(), [ui.tableSortedAscendingColumn, ui.tableSortedDescendingColumn], ['asc', 'desc']).map(user =>
                    <Table.Row key={user._id} onClick={(event, data) => this._handleOnClick(user)}>
                        {ui.showIdColumn ? <Table.Cell>{user._id}</Table.Cell> : null}
                        <Table.Cell>{user.username}</Table.Cell>
                        <Table.Cell>{user.firstName}</Table.Cell>
                        <Table.Cell>{user.lastName}</Table.Cell>
                        <Table.Cell>{user.company}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell textAlign='center'>{user.loggedIn ? <Icon size='large' name='check' color='green'/> : null}</Table.Cell>
                        <Table.Cell textAlign='center'>{user.accountLocked ? <Icon size='large' name='check' color='green'/> : null}</Table.Cell>
                        <Table.Cell>{user.lastLogin}</Table.Cell>
                        {ui.showCreatedColumns ? <Table.Cell>{user.createdAt}</Table.Cell> : null}
                        {ui.showCreatedColumns ? <Table.Cell>{user.createdBy}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{user.changedAt}</Table.Cell> : null}
                        {ui.showChangedColumns ? <Table.Cell>{user.changedBy}</Table.Cell> : null}
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