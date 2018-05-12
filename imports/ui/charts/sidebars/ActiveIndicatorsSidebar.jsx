import React from 'react'
import {Menu, Grid, Icon, Sidebar} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {each, filter, isEmpty} from 'lodash'

import Accordion from './IndicatorAccordion'
import TAP from '../../common/TAP'

@inject('indicators', 'records', 'ui') @observer
export default class ActiveIndicatorsSidebar extends React.Component {

    _handleOnClick = (_id, type) => {

        const {indicators, records, ui} = this.props

        indicators.toggleActive(_id)

        switch (type) {
            case 'index':
                records.setIndexIdsToFind(indicators.activeIndexIds)
                break
            case 'pillar':
                records.setPillarIdsToFind(indicators.activePillarIds)
                break
            case 'subpillar':
                records.setSubpillarIdsToFind(indicators.activeSubpillarIds)
                break
        }

        records.updateRecordsDataForChart()
        ui.setDisabled()

    }

    render() {

        const {indicators, ui, visible} = this.props

        const items = []

        each(filter(indicators.data, 'active'), indicator => {

            items.push(
                <Accordion.Title key={indicator._id} className='active-sidebar-title' onClick={() => this._handleOnClick(indicator._id, indicator.type)}>

                    <Menu style={{backgroundColor: 'white'}} borderless>

                        <Menu.Item style={{backgroundColor: '#9b9b9b', color: 'white'}}>
                            <Icon name={indicator.icon}/><TAP translate={indicator.type}/>
                        </Menu.Item>

                        <Menu.Item>
                            {ui.language === 'en' ? <TAP text={indicator.nameEn}/> : <TAP text={indicator.nameAr}/>}
                        </Menu.Item>

                        <Menu.Menu position='right'>
                            <Menu.Item style={{backgroundColor: 'white', borderRadius: '0 4px 4px 0'}}>
                                <Icon name='close' style={{float: 'right', fontSize: '1.5em'}}/>
                            </Menu.Item>
                        </Menu.Menu>

                    </Menu>

                </Accordion.Title>
            )

        })

        const accordion =
            isEmpty(items) ?
                null :
                <Accordion exclusive={false}>
                    {items}
                </Accordion>

        return (
            <Sidebar
                className='margin-240'
                animation='overlay'
                direction='left'
                visible={visible}
                style={{width: 530}}
            >

                <Grid columns={1} padded>
                    <Grid.Column>
                        {accordion}
                    </Grid.Column>
                </Grid>

            </Sidebar>
        )

    }

}