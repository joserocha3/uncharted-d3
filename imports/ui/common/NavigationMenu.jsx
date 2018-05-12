import React from 'react'
import {Icon, Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import Logo from './Logo'
import TAP from './TAP'

@inject('ui') @observer
export default class NavigationMenu extends React.Component {

    state = {facebookHover: false, twitterHover: false}

    _handleItemClick = (e, {name}) => {

        const {ui} = this.props

        ui.navigationMenuItemClicked(name)
        FlowRouter.go('/' + ui.language + '/' + name)
    }

    render() {

        const {ui} = this.props
        const {facebookHover, twitterHover} = this.state

        const facebookColor = facebookHover ? 'facebook-color' : null
        const twitterColor = twitterHover ? 'twitter-color' : null

        return (
            <Menu
                fixed='top'
                borderless
                inverted
                id='navigation-menu'
            >

                <Menu.Item><Logo/></Menu.Item>

                <Menu.Item
                    name='chart'
                    active={ui.activeNavigationMenuItem === 'chart'}
                    onClick={this._handleItemClick}
                    content={<TAP translate='data_visualization'/>}
                />

                <Menu.Item
                    name='profile'
                    active={ui.activeNavigationMenuItem === 'profile'}
                    onClick={this._handleItemClick}
                    content={<TAP translate='country_profiles'/>}
                />

                <Menu.Item
                    name='infographic'
                    active={ui.activeNavigationMenuItem === 'infographic'}
                    onClick={this._handleItemClick}
                    content={<TAP translate='infographics'/>}
                />

                <Menu.Item
                    name='sponsors'
                    active={ui.activeNavigationMenuItem === 'sponsors'}
                    onClick={this._handleItemClick}
                    content={<TAP translate='sponsors'/>}
                />

                <Menu.Menu position='right'>
                    <Menu.Item
                        onMouseOver={() => this.setState({twitterHover: true})}
                        onMouseOut={() => this.setState({twitterHover: false})}
                        className={twitterColor}
                        href='#'
                        target='_blank'
                        content={<Icon link name='twitter' size='big'/>}
                    />
                    <Menu.Item
                        onMouseOver={() => this.setState({facebookHover: true})}
                        onMouseOut={() => this.setState({facebookHover: false})}
                        className={facebookColor}
                        href='#'
                        target='_blank'
                        content={<Icon link name='facebook f' size='big'/>}
                    />
                </Menu.Menu>

            </Menu>
        )

    }

}
