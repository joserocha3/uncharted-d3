/*-------------------------------------------------------------------------*
 * Object name:   IndicatorSubpillarForm.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render subpillar form
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master         07/09/2017  Pablo Rocha  - Add 2015 checkbox
 * master  #21    07/10/2017  Pablo Rocha  - Move checkbox to top of form
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

// Components
import FormSelectIndex from '../../common/FormSelectIndex'
import FormSelectPillar from '../../common/FormSelectPillar'
import FormSelectSubpillar from '../../common/FormSelectSubpillar'
import TAP from '../../common/TAP'

@inject('indicators', 'ui') @observer
export default class IndicatorSubpillarForm extends React.Component {

    _handleSearch = e => {
        e.preventDefault()
        const {indicators} = this.props
        indicators.setSubpillarIdsToDisplay()
    }

    _handleClear = e => {
        e.preventDefault()
        const {indicators} = this.props
        indicators.setSelectedIndexIds([])
        indicators.setSelectedPillarIds([])
        indicators.setSelectedSubpillarIds([])
        indicators.setSubpillarIdsToDisplay()
    }

    render() {

        const {indicators} = this.props

        return (
            <Form onSubmit={this._handleSubmit}>

                <Form.Checkbox label='Show 2015 records' name='show2015Records' checked={indicators.show2015} onChange={(event, data) => indicators.setShow2015(data.checked)}/>
                <Form.Checkbox label='Show deleted records' name='showRecordsMarkedForDeletion' checked={indicators.showDeleted} onChange={(event, data) => indicators.setShowDeleted(data.checked)}/>

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