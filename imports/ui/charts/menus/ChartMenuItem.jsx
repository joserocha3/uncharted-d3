import React from 'react'
import {Button, Grid, Image, Menu, Popup} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import TAP from '../../common/TAP'

@inject('ui') @observer
export default class ChartMenuItem extends React.Component {

    _handleItemClick = () => {
        const {name, ui} = this.props
        ui.closeSidebars()
        FlowRouter.go('/' + ui.language + '/chart/' + name)
    }

    render() {

        const {disabled, name, popupText, ui} = this.props

        // Place Button inside a div so the popup is triggered when button is disabled

        return (
            <Menu.Item
                name={name}
            >
                <Popup
                    trigger={
                        <div>
                            <Button
                                className='white'
                                active={ui.activeChartMenuItem === name}
                                compact
                                disabled={disabled}
                                onClick={disabled ? null : this._handleItemClick}
                            >
                                <div>
                                    <Grid columns={1}>
                                        <Grid.Column only='computer'>
                                            <Image src={'/../images/' + name + (ui.activeChartMenuItem === name ? '-selected' : '') + '.svg'} width={14} spaced/>
                                            <TAP translate={name}></TAP>
                                        </Grid.Column>
                                        <Grid.Column only='tablet'>
                                            <Image src={'/../images/' + name + (ui.activeChartMenuItem === name ? '-selected' : '') + '.svg'} width={14} spaced/>
                                            <TAP translate={name}></TAP>
                                        </Grid.Column>
                                        <Grid.Column only='mobile'>
                                            <Image src={'/../images/' + name + (ui.activeChartMenuItem === name ? '-selected' : '') + '.svg'} width={14} spaced/>
                                        </Grid.Column>
                                    </Grid>
                                </div>
                            </Button>
                        </div>
                    }
                    content={popupText}
                    position='bottom center'
                    inverted
                />
            </Menu.Item>
        )

    }

}