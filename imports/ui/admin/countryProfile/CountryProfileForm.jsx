/*-------------------------------------------------------------------------*
 * Object name:   CountryProfileForm.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render country profiles form
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #21    07/10/2017  Pablo Rocha  - Move checkbox to top of form
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

// Components
import FormSelectCountry from '../../common/FormSelectCountry'
import FormSelectIso from '../../common/FormSelectIso'
import TAP from '../../common/TAP'

@inject('countries') @observer
export default class CountryProfileForm extends React.Component {

    _handleSearch = e => {
        e.preventDefault()
        const {countries} = this.props
        countries.setCountryIdsToDisplay()
    }

    _handleClear = e => {
        e.preventDefault()
        const {countries} = this.props
        countries.setSelectedCountryIds([])
        countries.setSelectedIsoIds([])
        countries.setCountryIdsToDisplay([])
    }

    render() {

        const {countries} = this.props

        return (
            <Form>

                <Form.Checkbox label='Show deleted records' name='showRecordsMarkedForDeletion' onChange={(event, data) => countries.setShowDeleted(data.checked)}/>

                <Form.Group widths='equal'>
                    <FormSelectCountry/>
                    <FormSelectIso/>
                </Form.Group>

                <Form.Group>
                    <Form.Button color='teal' content={<TAP translate='search'/>} icon='search' onClick={this._handleSearch}/>
                    <Form.Button color='red' content={<TAP translate='clear'/>} icon='close' onClick={this._handleClear}/>
                </Form.Group>

            </Form>
        )

    }

}