/*-------------------------------------------------------------------------*
 * Object name:   RecordsModal.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component to render a drop down for available years and update ui store accordingly
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master         07/09/2017  Pablo Rocha  - Change available years
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Message, Modal} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {isEmpty, isUndefined, isNaN, times, find, map} from 'lodash'
import Alert from 'react-s-alert'

// Components
import TAP from '../../common/TAP'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class RecordsModal extends React.Component {

    _handleCancel = e => {
        e.preventDefault()
        const {records, ui} = this.props
        records.setUpdateRecord({})
        ui.setActiveAdminModal('')
        ui.setErrorMessages([])
    }

    _handleSave = e => {
        e.preventDefault()

        const {records, ui} = this.props

        let messages = []

        if (isEmpty(records.updateRecord.country)) messages.push('Country is required')
        if (isEmpty(records.updateRecord.index) && isEmpty(records.updateRecord.subpillar) && isEmpty(records.updateRecord.subpillar)) messages.push('Enter index, pillar, and/or subpillar is required')
        if (isUndefined(records.updateRecord.year)) messages.push('Year is required')
        if (isEmpty(records.updateRecord.value)) messages.push('Value is required')

        records.updateRecord.year = parseFloat(records.updateRecord.year)
        records.updateRecord.value = parseFloat(records.updateRecord.value)

        if (isNaN(records.updateRecord.year)) messages.push('Year must be numeric')
        if (isNaN(records.updateRecord.value)) messages.push('Value must be numeric')

        ui.setErrorMessages(messages)

        if (messages.length > 0) return

        ui.setFormSubmitting(true)

        if (!records.updateRecord._id) {

            const data = {
                country: records.updateRecord.country,
                index: records.updateRecord.index,
                pillar: records.updateRecord.pillar,
                subpillar: records.updateRecord.subpillar,
                year: records.updateRecord.year,
                value: records.updateRecord.value
            }

            Meteor.call('records.new', data, (error, result) => {
                if (error) {
                    messages.push(error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('Record was created')
                    records.setUpdateRecord({})
                    ui.setActiveAdminModal('')
                    ui.setErrorMessages([])
                    records.updateRecordsDataForAdmin()
                }
                ui.setFormSubmitting(false)
            })

        } else {

            const data = {
                country: records.updateRecord.country,
                index: records.updateRecord.index,
                pillar: records.updateRecord.pillar,
                subpillar: records.updateRecord.subpillar,
                year: records.updateRecord.year,
                value: records.updateRecord.value
            }

            Meteor.call('records.update', records.updateRecord._id, data, (error, result) => {
                if (error) {
                    messages.push(error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('Record was updated')
                    records.setUpdateRecord({})
                    ui.setActiveAdminModal('')
                    ui.setErrorMessages([])
                    records.updateRecordsDataForAdmin()
                }
                ui.setFormSubmitting(false)
            })

        }

    }

    _handleOnChange = (event, data) => {
        const {records} = this.props
        switch (data.name) {
            case 'index':
                records.setUpdateRecord({...records.updateRecord, [data.name]: data.value, pillar: '', subpillar: ''}, true)
                break
            case 'pillar':
                records.setUpdateRecord({...records.updateRecord, [data.name]: data.value, subpillar: ''}, true)
                break
            case 'subpillar':
            case 'year':
                records.setUpdateRecord({...records.updateRecord, [data.name]: data.value}, true)
                break
            default:
                records.setUpdateRecord({...records.updateRecord, [data.name]: data.value})
                break
        }
    }

    render() {

        const {countries, indicators, records, ui} = this.props

        const errorMessages = ui.errorMessages.slice()

        const years = times(2, i => ({key: 2016 + i, text: 2016 + i, value: 2016 + i}))

        const {country, index, pillar, subpillar, year, value} = records.updateRecord

        const indexObject = find(indicators.data, {_id: index}) || {}
        const pillarOptions = !indexObject ? [] : map(indexObject.pillars, pillar => ({key: pillar._id, text: pillar.nameEn, value: pillar._id}))

        const pillarObject = find(indexObject.pillars, {_id: pillar}) || {}
        const subpillarOptions = !indexObject ? [] : map(pillarObject.subpillars, subpillar => ({key: subpillar._id, text: subpillar.nameEn, value: subpillar._id}))

        const update = records.updateRecord._id ? true : false

        return (
            <Modal open={ui.activeAdminModal === 'recordsNew'}>

                <Modal.Header><TAP translate={update ? 'update_record' : 'add_record'}/></Modal.Header>

                <Modal.Content as={Form} loading={ui.formSubmitting} onSubmit={this._handleSave} id='theForm' error={errorMessages.length > 0}>
                    {update ? <Form.Input name='_id' label='ID' defaultValue={records.updateRecord._id} disabled/> : null}
                    <Form.Select search name='country' label='Country' placeholder='Country' value={country} options={countries.dropdownCountryOptions} onChange={this._handleOnChange} disabled={update}/>
                    <Form.Select search name='index' label='Index' placeholder='Index' value={index} options={indicators.dropdownIndexOptions} onChange={this._handleOnChange} disabled={update}/>
                    <Form.Select search name='pillar' label='Pillar' placeholder='Pillar' value={pillar || ''} options={pillarOptions} onChange={this._handleOnChange} disabled={update}/>
                    <Form.Select search name='subpillar' label='Subpillar' placeholder='Subpillar' value={subpillar || ''} options={subpillarOptions} onChange={this._handleOnChange} disabled={update}/>
                    <Form.Select search name='year' label='Year' placeholder='Year' value={year} options={years} onChange={this._handleOnChange} disabled={update}/>
                    <Form.Input type='number' step='any' name='value' label='Value' placeholder='Value' value={value || ''} onChange={this._handleOnChange}/>
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