/*-------------------------------------------------------------------------*
 * Object name:   IndicatorSubpillarModal.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render modal for subpillar creation and update
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Add SketchPicker for color selection
 *                                         - Validate color then to Meteor.call method calls
 *                                         - Clear ui.colorPickerValue when done with modal
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Message, Modal} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {isEmpty} from 'lodash'
import {SketchPicker} from 'react-color'
import Alert from 'react-s-alert'

// Components
import TAP from '../../common/TAP'

@inject('indicators', 'ui') @observer
export default class IndicatorSubpillarModal extends React.Component {

    _handleCancel = e => {
        e.preventDefault()
        const {indicators, ui} = this.props
        indicators.setUpdateSubpillar({})
        ui.setActiveAdminModal('')
        ui.setErrorMessages([])
        ui.setColorPickerValue('')
    }

    _handleSave = e => {
        e.preventDefault()

        const {indicators, ui} = this.props

        let messages = []

        if (isEmpty(indicators.updateSubpillar.index)) messages.push('Index is required')
        if (isEmpty(indicators.updateSubpillar.pillar)) messages.push('Pillar is required')
        if (isEmpty(indicators.updateSubpillar.nameEn)) messages.push('Name EN is required')
        if (isEmpty(indicators.updateSubpillar.nameAr)) messages.push('Name AR is required')
        if (isEmpty(ui.colorPickerValue)) messages.push('Color is required')

        ui.setErrorMessages(messages)

        if (messages.length > 0) return

        ui.setFormSubmitting(true)

        if (!indicators.updateSubpillar._id) {

            const data = {
                index: indicators.updateSubpillar.index,
                pillar: indicators.updateSubpillar.pillar,
                nameEn: indicators.updateSubpillar.nameEn,
                nameAr: indicators.updateSubpillar.nameAr,
                color: ui.colorPickerValue
            }

            Meteor.call('subpillars.new', data, (error, result) => {
                if (error) {
                    messages.push(error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('Subpillar was created')
                    indicators.setUpdateSubpillar({})
                    ui.setActiveAdminModal('')
                    ui.setErrorMessages([])
                    ui.setColorPickerValue('')
                }
                ui.setFormSubmitting(false)
            })

        } else {

            const data = {
                _id: indicators.updateSubpillar._id,
                index: indicators.updateSubpillar.index,
                pillar: indicators.updateSubpillar.pillar,
                nameEn: indicators.updateSubpillar.nameEn,
                nameAr: indicators.updateSubpillar.nameAr,
                color: ui.colorPickerValue
            }

            Meteor.call('subpillars.update', data, (error, result) => {
                if (error) {
                    messages.push(error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('Subpillar was updated')
                    indicators.setUpdateSubpillar({})
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
        switch (data.name) {
            case 'index':
                indicators.setUpdateSubpillar({...indicators.updateSubpillar, index: data.value, pillar: ''})
                break
            case 'pillar':
                indicators.setUpdateSubpillar({...indicators.updateSubpillar, pillar: data.value})
                break
            default:
                indicators.setUpdateSubpillar({...indicators.updateSubpillar, [data.name]: data.value})
                break
        }
    }

    _onChangeComplete = (color, event) => {
        const {ui} = this.props
        ui.setColorPickerValue(color.hex)
    }

    render() {

        const {indicators, ui} = this.props

        const errorMessages = ui.errorMessages.slice()

        const {index, pillar, nameEn, nameAr} = indicators.updateSubpillar

        const update = indicators.updateSubpillar._id ? true : false

        return (
            <Modal open={ui.activeAdminModal === 'indicatorSubpillarNew'}>

                <Modal.Header><TAP translate={!indicators.updateSubpillar._id ? 'add_record' : 'update_record'}/></Modal.Header>

                <Modal.Content as={Form} loading={ui.formSubmitting} onSubmit={this._handleSave} id='theForm' error={errorMessages.length > 0}>
                    {update ? <Form.Input name='_id' label='ID' defaultValue={indicators.updateSubpillar._id} disabled/> : null}
                    <Form.Group widths='equal'>
                        <Form.Select search name='index' label='Index' placeholder='Index' value={index || ''} options={indicators.dropdownIndexOptions || ''} onChange={this._handleOnChange} disabled={update}/>
                        <Form.Select search name='pillar' label='Pillar' placeholder='Pillar' value={pillar || ''} options={indicators.dropdownPillarOptionsForSubpillar || ''} onChange={this._handleOnChange} disabled={update}/>
                    </Form.Group>
                    <Form.Input name='nameEn' label='Name EN' placeholder='Name EN' value={nameEn || ''} onChange={this._handleOnChange}/>
                    <Form.Input name='nameAr' label='Name AR' placeholder='Name AR' value={nameAr || ''} onChange={this._handleOnChange}/>
                    <Form.Field label='Color' control={SketchPicker} disableAlpha presetColors={[]} onChangeComplete={this._onChangeComplete} color={ui.colorPickerValue}/>
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