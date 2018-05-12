import React from 'react'
import {Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import TAP from '../common/TAP'

@inject('ui') @observer
export default class AdminMenu extends React.Component {

    _handleItemClick = (e, {name}) => {
        FlowRouter.go('/' + '/admin/' + name)
    }

    render() {

        const {ui} = this.props

        return (
            <Menu
                vertical
                pointing
                inverted
                fixed='left'
                id='admin-menu'
            >

                <Menu.Item header><TAP translate='menu'/></Menu.Item>

                <Menu.Item
                    name='countries'
                    active={ui.activeAdminMenuItem === 'countries'}
                    onClick={this._handleItemClick}
                >
                    <TAP translate='countries'></TAP>
                </Menu.Item>

                <Menu.Item
                    name='countryProfile'
                    active={ui.activeAdminMenuItem === 'countryProfile'}
                    onClick={this._handleItemClick}
                >
                    <TAP translate='country_profile'></TAP>
                </Menu.Item>

                <Menu.Item
                    name='indicatorIndex'
                    active={ui.activeAdminMenuItem === 'indicatorIndex'}
                    onClick={this._handleItemClick}
                >
                    <TAP translate='indicator_index'></TAP>
                </Menu.Item>

                <Menu.Item
                    name='indicatorPillar'
                    active={ui.activeAdminMenuItem === 'indicatorPillar'}
                    onClick={this._handleItemClick}
                >
                    <TAP translate='indicator_pillar'></TAP>
                </Menu.Item>

                <Menu.Item
                    name='indicatorSubpillar'
                    active={ui.activeAdminMenuItem === 'indicatorSubpillar'}
                    onClick={this._handleItemClick}
                >
                    <TAP translate='indicator_subpillar'></TAP>
                </Menu.Item>

                <Menu.Item
                    name='records'
                    active={ui.activeAdminMenuItem === 'records'}
                    onClick={this._handleItemClick}
                >
                    <TAP translate='records'></TAP>
                </Menu.Item>

                <Menu.Item
                    name='users'
                    active={ui.activeAdminMenuItem === 'users'}
                    onClick={this._handleItemClick}
                >
                    <TAP translate='users'></TAP>
                </Menu.Item>

            </Menu>
        )

    }

}