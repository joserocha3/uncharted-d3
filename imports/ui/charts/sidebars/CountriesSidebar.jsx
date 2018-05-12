import React from 'react'
import {Button, Grid, Icon, Image, List, Sidebar} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {forEach, map} from 'lodash'

import TAP from '../../common/TAP'

@inject('countries', 'records', 'ui') @observer
export default class CountriesSidebar extends React.Component {

    _onItemClick = (_id, e) => {

        const {countries, records, ui} = this.props

        countries.toggleActive(_id)
        records.setCountryIdsToFind(countries.activeIds)
        records.updateRecordsDataForChart()

        ui.setDisabled()

    }

    _onSelectAllClick = () => {

        const {countries, records, ui} = this.props

        countries.activateAll(countries.data.length !== countries.activeIds.length)
        records.setCountryIdsToFind(countries.activeIds)
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
            $('#countries-sidebar').hasVerticalScrollBar()

        const elements = document.querySelectorAll('.countries-sidebar-add-rtl-padding')

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

        const {countries, ui, visible} = this.props

        const items = map(countries.data.slice(), country => {

            return (
                <List.Item
                    key={country._id}
                    onClick={this._onItemClick.bind(this, country._id)}
                    active={country.active}
                >

                    <List.Content style={{color: country.active ? country.color : ''}}>
                        {country.flag ?
                            <Image src={country.flag} size='mini' spaced/> :
                            <Icon name='flag' size='big' disabled/>
                        }
                        {ui.language === 'en' ? <TAP text={country.nameEn}/> : <TAP text={country.nameAr}/>}
                    </List.Content>

                </List.Item>
            )

        })

        return (
            <Sidebar
                id='countries-sidebar'
                className='margin-240'
                animation='overlay'
                direction='left'
                visible={visible}
            >

                <Grid columns={1} padded>

                    <Grid.Column className='countries-sidebar-add-rtl-padding'>
                        <Button
                            content={<TAP translate={countries.data.length === countries.activeIds.length ? 'deselect_all' : 'select_all'}/>}
                            fluid
                            onClick={this._onSelectAllClick}
                        />
                    </Grid.Column>

                    <Grid.Column className='countries-sidebar-add-rtl-padding'>
                        <List verticalAlign='middle' selection>
                            {items}
                        </List>
                    </Grid.Column>

                </Grid>

            </Sidebar>
        )

    }

}