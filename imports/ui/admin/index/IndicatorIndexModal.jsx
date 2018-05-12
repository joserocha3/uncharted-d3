/*-------------------------------------------------------------------------*
 * Object name:   IndicatorIndexModal.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render modal for index creation and update
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Add SketchPicker for color selection
 *                                         - Validate color then to Meteor.call method calls
 *                                         - Clear ui.colorPickerValue when done with modal
 * master  #22.1  07/14/2017  Pablo Rocha  - Remove profileIcon TODO: replace with colorIcon and whiteIcon
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Message, Modal} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {isEmpty, isNaN} from 'lodash'
import {SketchPicker} from 'react-color'
import Alert from 'react-s-alert'

// Components
import TAP from '../../common/TAP'

@inject('indicators', 'ui') @observer
export default class IndicatorIndexModal extends React.Component {

    _handleCancel = e => {
        e.preventDefault()
        const {indicators, ui} = this.props
        indicators.setUpdateIndex({})
        ui.setActiveAdminModal('')
        ui.setErrorMessages([])
        ui.setColorPickerValue('')
    }

    _handleSave = e => {
        e.preventDefault()

        const {indicators, ui} = this.props

        let messages = []

        if (isEmpty(indicators.updateIndex.nameEn)) messages.push('Name EN is required')
        if (isEmpty(indicators.updateIndex.nameAr)) messages.push('Name AR is required')
        if (isEmpty(ui.colorPickerValue)) messages.push('Color is required')
        if (isEmpty(indicators.updateIndex.indexType)) messages.push('Index Type is required')
        indicators.updateIndex.sortOrder = parseFloat(indicators.updateIndex.sortOrder)
        if (isNaN(indicators.updateIndex.sortOrder)) messages.push('Sort Order must be numeric')

        ui.setErrorMessages(messages)
        if (messages.length > 0) return

        ui.setFormSubmitting(true)

        if (!indicators.updateIndex._id) {

            const data = {
                nameEn: indicators.updateIndex.nameEn,
                nameAr: indicators.updateIndex.nameAr,
                color: ui.colorPickerValue,
                indexType: indicators.updateIndex.indexType,
                sortOrder: indicators.updateIndex.sortOrder
            }

            Meteor.call('indexes.new', data, (error, result) => {
                if (error) {
                    messages.push(error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('Index was created')
                    indicators.setUpdateIndex({})
                    ui.setActiveAdminModal('')
                    ui.setErrorMessages([])
                    ui.setColorPickerValue('')
                }
                ui.setFormSubmitting(false)
            })

        } else {

            const data = {
                _id: indicators.updateIndex._id,
                nameEn: indicators.updateIndex.nameEn,
                nameAr: indicators.updateIndex.nameAr,
                color: ui.colorPickerValue,
                indexType: indicators.updateIndex.indexType,
                sortOrder: indicators.updateIndex.sortOrder
            }

            Meteor.call('indexes.update', data, (error, result) => {
                if (error) {
                    messages.push(error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('Index was updated')
                    indicators.setUpdateIndex({})
                    ui.setActiveAdminModal('')
                    ui.setErrorMessages([])
                    ui.setColorPickerValue('')
                }
                ui.setFormSubmitting(false)
            })

        }

    }

    _handleOnChange = (event, data) => {
        const {indicators} = this.props
        indicators.setUpdateIndex({...indicators.updateIndex, [data.name]: data.value})
    }

    _onChangeComplete = (color, event) => {
        const {ui} = this.props
        ui.setColorPickerValue(color.hex)
    }

    render() {

        const {indicators, ui} = this.props

        const errorMessages = ui.errorMessages.slice()

        const {_id, nameEn, nameAr, indexType, sortOrder} = indicators.updateIndex

        return (
            <Modal open={ui.activeAdminModal === 'indicatorIndexNew'}>

                <Modal.Header><TAP translate={indicators.updateIndex._id ? 'update_record' : 'add_record'}/></Modal.Header>

                <Modal.Content as={Form} loading={ui.formSubmitting} onSubmit={this._handleSave} id='theForm' error={errorMessages.length > 0}>

                    {_id ? <Form.Input name='_id' label='ID' defaultValue={_id} disabled/> : null}
                    <Form.Input name='nameEn' label='Name EN' value={nameEn} placeholder='Name EN' onChange={this._handleOnChange}/>
                    <Form.Input name='nameAr' label='Name AR' value={nameAr} placeholder='Name AR' onChange={this._handleOnChange}/>
                    <Form.Field label='Color' control={SketchPicker} disableAlpha presetColors={[]} onChangeComplete={this._onChangeComplete} color={ui.colorPickerValue}/>
                    <Form.Select search name='indexType' label='Index Type' placeholder='Index Type' value={indexType || ''} options={indicators.dropdownIndexTypeOptions || ''} onChange={this._handleOnChange}/>
                    <Form.Input type='number' name='sortOrder' label='Sort Order' value={sortOrder} placeholder='Sort Order' onChange={this._handleOnChange}/>

                    <Message
                        error
                        header='Error'
                        list={ui.errorMessages.slice()}
                    />

                </Modal.Content>

                <Modal.Actions>
                    <Button negative onClick={this._handleCancel} content='Cancel' disabled={ui.formSubmitting}/>
                    <Button positive labelPosition='right' icon='checkmark' content='Save' form='theForm' disabled={ui.formSubmitting}/>
                </Modal.Actions>

            </Modal>
        )

    }

}