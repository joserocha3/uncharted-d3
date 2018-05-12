import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import Logo from '../common/Logo'
import TAP from '../common/TAP'

@inject('users') @observer
export default class NavigationMenu extends React.Component {

    render() {

        const {users} = this.props

        return (
            <Menu borderless inverted id='navigation-menu' fixed='top'>

                <Menu.Item><Logo admin/></Menu.Item>

                <Menu.Menu position='right'>
                    <Menu.Item
                        color='teal'
                        content={users.currentUser}
                    />
                    <Menu.Item
                        onClick={() => Meteor.logout()}
                        content={<TAP translate='sign_out'/>}
                    />
                    <Menu.Item
                        onClick={() => FlowRouter.go('/en/chart')}
                        content={<TAP translate='go_to_charts'/>}
                    />
                </Menu.Menu>

            </Menu>
        )

    }

}