import React from 'react'
import {Table} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

@inject('ui') @observer
export default class TableHeaderCell extends React.Component {

    _sortedBy = column => {

        const {ui} = this.props

        const value = ui.tableSortedAscendingColumn === column ? 'ascending' :
            ui.tableSortedDescendingColumn === column ? 'descending' : null

        return value

    }

    _sortColumn = column => {

        const {ui} = this.props

        if (ui.tableSortedAscendingColumn === column) {
            ui.setTableSortedAscendingColumn('')
            ui.setTableSortedDescendingColumn(column)
        } else {
            ui.setTableSortedAscendingColumn(column)
            ui.setTableSortedDescendingColumn('')
        }

    }

    render() {

        const {column, name} = this.props

        return (
            <Table.HeaderCell sorted={this._sortedBy(column)} onClick={() => this._sortColumn(column)}>{name}</Table.HeaderCell>
        )

    }

}