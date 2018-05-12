/*-------------------------------------------------------------------------*
 * Object name:   IndicatorIndexForm.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Indicators store classes and methods
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Remove call to method setColors
 *                                         - Remove colors variable
 *                                         - Assign Index/Pillar/Subpillar color from database
 * master         07/09/2017  Pablo Rocha  - Assign Index/Pillar/Subpillar 2015 boolean from database
 *                                         - Remove get2015 boolean, we want to pull them all now and
 *                                           the individual component filter by year
 * master  #21    07/10/2017  Pablo Rocha  - Move checkbox to top of form
 *                                          - Add Index Type dropdown, this was accidentally removed at some point
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

// Components
import FormSelectIndex from '../../common/FormSelectIndex'
import TAP from '../../common/TAP'

@inject('indicators', 'ui') @observer
export default class IndicatorIndexForm extends React.Component {

    _handleSearch = e => {
        e.preventDefault()
        const {indicators} = this.props
        indicators.setIndexIdsToDisplay()
        indicators.setIndexTypesToDisplay()
    }

    _handleClear = e => {
        e.preventDefault()
        const {indicators} = this.props
        indicators.setSelectedIndexIds([])
        indicators.setSelectedIndexTypes([])
        indicators.setIndexIdsToDisplay()
    }

    render() {

        const {indicators} = this.props

        return (
            <Form>

                <Form.Checkbox label='Show 2015 records' name='show2015Records' checked={indicators.show2015} onChange={(event, data) => indicators.setShow2015(data.checked)}/>
                <Form.Checkbox label='Show deleted records' name='showRecordsMarkedForDeletion' checked={indicators.showDeleted} onChange={(event, data) => indicators.setShowDeleted(data.checked)}/>

                <FormSelectIndex/>

                <Form.Select
                    label={<TAP translate='index_type'/>}
                    value={indicators.selectedIndexTypes.slice()}
                    onChange={(event, data) => indicators.setSelectedIndexTypes(data.value)}
                    name='types'
                    options={indicators.dropdownIndexTypeOptions}
                    search
                    multiple
                />

                <Form.Group>
                    <Form.Button color='teal' content={<TAP translate='search'/>} icon='search' onClick={this._handleSearch}/>
                    <Form.Button color='red' content={<TAP translate='clear'/>} icon='close' onClick={this._handleClear}/>
                </Form.Group>

            </Form>
        )

    }

}