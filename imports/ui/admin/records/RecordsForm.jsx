/*-------------------------------------------------------------------------*
 * Object name:   RecordsForm.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render records form
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
import FormSelectIndex from '../../common/FormSelectIndex'
import FormSelectPillar from '../../common/FormSelectPillar'
import FormSelectSubpillar from '../../common/FormSelectSubpillar'
import TAP from '../../common/TAP'

@inject('countries', 'indicators', 'records') @observer
export default class RecordsForm extends React.Component {

    _handleSearch = e => {
        e.preventDefault()
        const {countries, indicators, records} = this.props

        countries.setCountryIdsToDisplay()
        indicators.setIndexIdsToDisplay()
        indicators.setPillarIdsToDisplay()
        indicators.setSubpillarIdsToDisplay()

        records.setCountryIdsToFind(countries.countryIdsToDisplay)
        records.setIndexIdsToFind(indicators.indexIdsToDisplay)
        records.setPillarIdsToFind(indicators.pillarIdsToDisplay)
        records.setSubpillarIdsToFind(indicators.subpillarIdsToDisplay)
        records.updateRecordsDataForAdmin()
    }

    _handleClear = e => {
        e.preventDefault()
        const {countries, indicators, records} = this.props

        countries.setSelectedCountryIds([])
        countries.setSelectedIsoIds([])
        countries.setCountryIdsToDisplay([])

        indicators.setSelectedIndexIds([])
        indicators.setSelectedPillarIds([])
        indicators.setSelectedSubpillarIds([])
        indicators.setIndexIdsToDisplay()
        indicators.setPillarIdsToDisplay()
        indicators.setSubpillarIdsToDisplay()

        records.setCountryIdsToFind([])
        records.setIndexIdsToFind([])
        records.setPillarIdsToFind([])
        records.setSubpillarIdsToFind([])
        records.updateRecordsDataForAdmin()
    }

    render() {

        const {countries} = this.props

        return (
            <Form onSubmit={this._handleSubmit}>

                <Form.Checkbox label='Show deleted records' name='showRecordsMarkedForDeletion' onChange={(event, data) => countries.setShowDeleted(data.checked)}/>

                <Form.Group widths='equal'>
                    <FormSelectCountry/>
                    <FormSelectIso/>
                </Form.Group>

                <Form.Group widths='equal'>
                    <FormSelectIndex/>
                    <FormSelectPillar/>
                </Form.Group>

                <FormSelectSubpillar/>

                <Form.Group>
                    <Form.Button color='teal' content={<TAP translate='search'/>} icon='search' onClick={this._handleSearch}/>
                    <Form.Button color='red' content={<TAP translate='clear'/>} icon='close' onClick={this._handleClear}/>
                </Form.Group>

            </Form>
        )

    }

}