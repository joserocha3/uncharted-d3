/*-------------------------------------------------------------------------*
 * Object name:   IndicatorsSidebar.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Sidebar with accordion composed of indexes -> pillars - subpillars
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #22.1  07/14/2017  Pablo Rocha  - Replace profileIcon with colorIcon
 * master  #33.1  07/01/2017  Pablo Rocha  - Filter by chartIndexType
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Button, Menu, Grid, Icon, Image, Sidebar} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {forEach, each, map} from 'lodash'

// Components
import Accordion from './IndicatorAccordion'
import IndicatorsSearch from './IndicatorsSearch'
import TAP from '../../common/TAP'

@inject('indicators', 'records', 'ui') @observer
export default class IndicatorsSidebar extends React.Component {

    _handleOnClick = (_id, type) => {

        const {indicators, records, ui} = this.props

        if (type === 'icon') {
            indicators.toggleOpen(_id)
            return
        }

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

    _setStyleBasedOnScrollBar = () => {

        // Chrome is rendering nested scroll bars incorrectly for rtl, so change style

        (function ($) {
            $.fn.hasVerticalScrollBar = function () {
                return this.get(0) ? parseInt(this.get(0).scrollHeight) > parseInt(this.innerHeight()) : false
            }
        })(jQuery)

        const {ui} = this.props

        const isGoogleChrome = window.chrome != null &&
            window.navigator.vendor === "Google Inc." &&
            ui.language === 'ar' &&
            $('#indicators-sidebar').hasVerticalScrollBar()

        const elements = document.querySelectorAll('.indicators-sidebar-add-rtl-padding')

        forEach(elements, element => {
            if (isGoogleChrome) {
                element.style.paddingRight = '2rem'
                element.style.paddingLeft = '0'
            } else {
                element.style.paddingRight = '1rem' // semantic ui default
                element.style.paddingLeft = '1rem' // semantic ui default
            }
        })

    }

    componentDidMount() {
        this._setStyleBasedOnScrollBar()
        window.addEventListener('resize', this._setStyleBasedOnScrollBar)
    }

    componentDidUpdate() {
        this._setStyleBasedOnScrollBar()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._setStyleBasedOnScrollBar)
    }

    render() {

        const {indicators, ui, visible} = this.props

        const items = []

        each(indicators.nested.filter(i => i.indexType === indicators.chartIndexType), index => {

            items.push(
                <Accordion.Title key={index._id + '-title'} className={index.active ? 'active-selected title' : 'title'}>

                    <Menu>

                        <Menu.Item onClick={() => this._handleOnClick(index._id, 'index')} className='index-cap'>
                            <Image height={21} src={index.whiteIcon} alt={'icon'}/>
                        </Menu.Item>

                        <Menu.Item onClick={() => this._handleOnClick(index._id, 'index')} className='index-title'>
                            {ui.language === 'en' ? <TAP text={index.nameEn}/> : <TAP text={index.nameAr}/>}
                        </Menu.Item>

                        <Menu.Menu position='right'>
                            <Menu.Item onClick={() => this._handleOnClick(index._id, 'icon')} className='indicator-toggle'>
                                {index.open ? <Icon name='chevron up' color='teal' fitted/> : <Icon name='chevron down' fitted/>}
                            </Menu.Item>
                        </Menu.Menu>

                    </Menu>

                </Accordion.Title>
            )

            items.push(
                <Accordion.Content key={index._id + '-content'} className={index.open ? 'active content-pillar' : 'content-pillar'}>

                    {map(index.pillars, pillar =>

                        <Accordion key={pillar._id}>

                            <Accordion.Title className={pillar.active ? 'active-selected title' : 'title'}>

                                <Menu>

                                    <Menu.Item onClick={() => this._handleOnClick(pillar._id, 'pillar')} className='pillar-cap'>
                                        <Icon name={pillar.icon} fitted size='large'/>
                                    </Menu.Item>

                                    <Menu.Item onClick={() => this._handleOnClick(pillar._id, 'pillar')} className='pillar-title'>
                                        {ui.language === 'en' ? <TAP text={pillar.nameEn}/> : <TAP text={pillar.nameAr}/>}
                                    </Menu.Item>

                                    <Menu.Menu position='right'>
                                        <Menu.Item onClick={() => this._handleOnClick(pillar._id, 'icon')} className='indicator-toggle'>
                                            {pillar.open ? <Icon name='chevron up' color='teal' fitted/> : <Icon name='chevron down' fitted/>}
                                        </Menu.Item>
                                    </Menu.Menu>

                                </Menu>

                            </Accordion.Title>

                            <Accordion.Content className={pillar.open ? 'active content-subpillar' : 'content-subpillar'}>

                                {map(pillar.subpillars, subpillar =>

                                    <Accordion key={subpillar._id}>

                                        <Accordion.Title className={subpillar.active ? 'active-selected title' : 'title'}>

                                            <Menu>

                                                <Menu.Item onClick={() => this._handleOnClick(subpillar._id, 'subpillar')} className='subpillar-cap'>
                                                    <Icon name={subpillar.icon} size='large' fitted/>
                                                </Menu.Item>

                                                <Menu.Item onClick={() => this._handleOnClick(subpillar._id, 'subpillar')} className='subpillar-title'>
                                                    {ui.language === 'en' ? <TAP text={subpillar.nameEn}/> : <TAP text={subpillar.nameAr}/>}
                                                </Menu.Item>

                                            </Menu>

                                        </Accordion.Title>

                                    </Accordion>
                                )}

                            </Accordion.Content>

                        </Accordion>
                    )}

                </Accordion.Content>
            )

        })

        return (
            <Sidebar
                className='margin-240'
                id='indicators-sidebar'
                animation='overlay'
                direction='left'
                visible={visible}
                style={{width: 530}}
            >

                <Grid columns={1} padded>

                    <Grid.Column className='indicators-sidebar-add-rtl-padding'>
                        <IndicatorsSearch/>
                    </Grid.Column>

                    <Grid.Column className='indicators-sidebar-add-rtl-padding'>
                        <Button
                            floated='right'
                            content={<TAP translate='collapse_all'/>}
                            onClick={indicators.collapseAll}
                            icon='chevron up'
                        />
                        <Button
                            floated='right'
                            content={<TAP translate='expand_all'/>}
                            onClick={indicators.expandAll}
                            icon='chevron down'
                        />
                    </Grid.Column>

                    <Grid.Column className='indicators-sidebar-add-rtl-padding'>

                        <Accordion exclusive={false}>
                            {items}
                        </Accordion>

                    </Grid.Column>

                </Grid>

            </Sidebar>
        )

    }

}