/*-------------------------------------------------------------------------*
 * Object name:   ProfileSelectionMenu.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component to render leftmost vertical profile menu
 *-------------------------------------------------------------------------*
 * Modification history:
 * master  #33.1  07/01/2017  Pablo Rocha  - Add item for KI/RI selection
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {List, Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {map} from 'lodash'

// Components
import Dot from '../common/Dot'
import TAP from '../common/TAP'
import SimpleYearDropdown from '../common/SimpleYearDropdown'
import SimpleIndexTypeDropdown from '../common/SimpleIndexTypeDropdown'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class ProfileSelectionMenu extends React.Component {

    _onClick = country => {
        const {records} = this.props
        records.setProfileCountry(country)
        records.updateRecordsDataForProfile()
    }

    render() {

        const {countries, records, ui} = this.props

        const items = map(countries.data.slice(), country =>
            <List.Item
                key={country._id}
                onClick={() => this._onClick(country)}
                style={{cursor: 'pointer'}}
                content={
                    <div>
                        <Dot classed='legend-dot' createSvg={true} fill={country === records.profileCountry ? country.color : '#cacaca'}/>
                        <span style={{color: country === records.profileCountry ? country.color : '#cacaca'}}>{ui.language === 'en' ? <TAP text={country.nameEn}/> : <TAP text={country.nameAr}/>}</span>
                    </div>
                }
            />
        )

        return (
            <Menu
                id='profile-selection-menu'
                fixed='left'
                vertical
            >

                <Menu.Item header>
                    <TAP translate='country_profiles'/>
                </Menu.Item>

                <Menu.Item>
                    <SimpleYearDropdown/>
                </Menu.Item>

                <Menu.Item>
                    <SimpleIndexTypeDropdown/>
                </Menu.Item>

                <Menu.Item>
                    <Menu.Header><TAP translate='countries'/></Menu.Header>
                    <List relaxed>
                        {items}
                    </List>
                </Menu.Item>

            </Menu>
        )

    }

}