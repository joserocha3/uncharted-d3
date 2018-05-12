import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Image, Message, Modal} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {isEmpty} from 'lodash'
import {SketchPicker} from 'react-color'
import Dropzone from 'react-dropzone'
import Alert from 'react-s-alert'

import TAP from '../../common/TAP'

@inject('countries', 'ui') @observer
export default class CountriesNewModal extends React.Component {

    _handleCancel = e => {
        e.preventDefault()
        const {countries, ui} = this.props
        countries.setUpdateCountry({})
        ui.setActiveAdminModal('')
        ui.setDropZoneFlagFiles([])
        ui.setDropZoneHeaderFiles([])
        ui.setDropZoneMapFiles([])
        ui.setColorPickerValue('')
        ui.setErrorMessages([])
    }

    _handleSave = async e => {
        e.preventDefault()

        const {countries, ui} = this.props

        let messages = []

        if (isEmpty(countries.updateCountry.nameEn)) messages.push('Name EN is required')
        if (isEmpty(countries.updateCountry.nameAr)) messages.push('Name AR is required')
        if (isEmpty(countries.updateCountry.iso)) messages.push('ISO is required')
        if (isEmpty(ui.dropZoneFlagFiles)) messages.push('Flag is required')
        if (isEmpty(ui.colorPickerValue)) messages.push('Color is required')
        if (isEmpty(ui.dropZoneHeaderFiles)) messages.push('Profile Header is required')
        if (isEmpty(ui.dropZoneMapFiles)) messages.push('Profile Map is required')

        ui.setErrorMessages(messages)

        if (messages.length > 0) return

        ui.setFormSubmitting(true)

        const data = {
            nameEn: countries.updateCountry.nameEn,
            nameAr: countries.updateCountry.nameAr,
            iso: countries.updateCountry.iso,
            flag: ui.dropZoneFlagFiles[0],
            profileHeader: ui.dropZoneHeaderFiles[0],
            profileMap: ui.dropZoneMapFiles[0],
            color: ui.colorPickerValue
        }

        data._id = await this._getNextId()
        data.flag = await this._upload('uploadFlag', data._id, data.flag)
        data.profileHeader = await this._upload('uploadProfileHeader', data._id, data.profileHeader)
        data.profileMap = await this._upload('uploadProfileMap', data._id, data.profileMap)

        Meteor.call('countries.new', data, (error, result) => {
            if (error) {
                messages.push(error.message)
                ui.setErrorMessages(messages)
            } else {
                Alert.success('Country was created')
                ui.setActiveAdminModal('')
                ui.setDropZoneFlagFiles([])
                ui.setDropZoneHeaderFiles([])
                ui.setDropZoneMapFiles([])
                ui.setColorPickerValue('')
                ui.setErrorMessages([])
            }
            ui.setFormSubmitting(false)
        })

    }

    _getNextId = () => {
        return new Promise(resolve => {
            Meteor.call('countries.getNextId', (error, result) => {
                if (error) {
                    console.log('could not execute getNextId Meteor call')
                } else {
                    return resolve(result)
                }
            })
        })
    }

    _upload = (directive, _id, file) => {
        const uploader = new Slingshot.Upload(directive, {fileName: _id})
        return new Promise(resolve => {
            uploader.send(file, function (error, downloadUrl) {
                if (error) {
                    // console.error('Error uploading', uploader.xhr.response)
                    // messages.push(error.message)
                    // ui.setErrorMessages(messages)
                }
                else {
                    return resolve(downloadUrl)
                }
            })
        })
    }

    _onChangeComplete = (color, event) => {
        const {ui} = this.props
        ui.setColorPickerValue(color.hex)
    }

    _onDropFlag = (acceptedFiles, rejectedFiles) => {
        const {ui} = this.props
        ui.setDropZoneFlagFiles(acceptedFiles)
    }

    _onDropHeader = (acceptedFiles, rejectedFiles) => {
        const {ui} = this.props
        ui.setDropZoneHeaderFiles(acceptedFiles)
    }

    _onDropMap = (acceptedFiles, rejectedFiles) => {
        const {ui} = this.props
        ui.setDropZoneMapFiles(acceptedFiles)
    }

    _handleOnChange = (event, data) => {
        const {countries} = this.props
        countries.setUpdateCountry({...countries.updateCountry, [data.name]: data.value})
    }

    render() {

        const {countries, ui} = this.props

        const errorMessages = ui.errorMessages.slice()

        const dropZonePreviewFlag = isEmpty(ui.dropZoneFlagFiles) ? null : ui.dropZoneFlagFiles[0].preview
        const dropZonePreviewHeader = isEmpty(ui.dropZoneHeaderFiles) ? null : ui.dropZoneHeaderFiles[0].preview
        const dropZonePreviewMap = isEmpty(ui.dropZoneMapFiles) ? null : ui.dropZoneMapFiles[0].preview

        const {nameEn, nameAr, iso} = countries.updateCountry

        return (
            <Modal open={ui.activeAdminModal === 'countriesNew'}>

                <Modal.Header><TAP translate='add_record'/></Modal.Header>

                <Modal.Content as={Form} loading={ui.formSubmitting} onSubmit={this._handleSave} id='theForm' error={errorMessages.length > 0}>

                    <Form.Input name='nameEn' label='Name EN' placeholder='Name EN' value={nameEn || ''} onChange={this._handleOnChange}/>
                    <Form.Input name='nameAr' label='Name AR' placeholder='Name AR' value={nameAr || ''} onChange={this._handleOnChange}/>
                    <Form.Input name='iso' label='ISO' placeholder='ISO' value={iso || ''} onChange={this._handleOnChange}/>

                    <Form.Field>
                        <label>Flag</label>
                        <Dropzone onDrop={this._onDropFlag} multiple={false} accept='image/*' className='dropzone-custom'>
                            Drop an image file here, or click to select a file to upload
                        </Dropzone>
                    </Form.Field>
                    <Form.Field control={Image} src={dropZonePreviewFlag} size='tiny'/>

                    <Form.Field label='Color' control={SketchPicker} disableAlpha presetColors={[]} onChangeComplete={this._onChangeComplete} color={ui.colorPickerValue}/>

                    <Form.Field>
                        <label>Profile Header</label>
                        <Dropzone onDrop={this._onDropHeader} multiple={false} accept='image/*' className='dropzone-custom'>
                            Drop an image file here, or click to select a file to upload
                        </Dropzone>
                    </Form.Field>
                    <Form.Field control={Image} src={dropZonePreviewHeader} size='tiny'/>

                    <Form.Field>
                        <label>Profile Map</label>
                        <Dropzone onDrop={this._onDropMap} multiple={false} accept='image/*' className='dropzone-custom'>
                            Drop an image file here, or click to select a file to upload
                        </Dropzone>
                    </Form.Field>
                    <Form.Field control={Image} src={dropZonePreviewMap} size='tiny'/>

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