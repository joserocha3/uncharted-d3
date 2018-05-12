import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Message, Modal} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {isEmpty} from 'lodash'
import Alert from 'react-s-alert'

import TAP from '../../common/TAP'

@inject('users', 'ui') @observer
export default class UsersModal extends React.Component {

    state = {
        unlockAccountMessage: false,
        forceLogoutAccountMessage: false
    }

    _validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    }

    _handleUnlockAccount = e => {

        e.preventDefault()

        const {users, ui} = this.props

        ui.setFormSubmitting(true)

        Meteor.call('users.resetLoginFailedAttempts', users.updateUser._id, (error, result) => {
            if (error) {
                console.log(error)
                messages.push(error.reason || error.message)
            } else {
                users.setUpdateUser({...users.updateUser, accountLocked: false})
                this.setState({unlockAccountMessage: true})
            }
            ui.setFormSubmitting(false)
        })

    }

    _handleForceSignOut = e => {

        e.preventDefault()

        const {users, ui} = this.props

        ui.setFormSubmitting(true)

        Meteor.call('users.logout', users.updateUser._id, (error, result) => {
            if (error) {
                console.log(error)
                messages.push(error.reason || error.message)
            } else {
                users.setUpdateUser({...users.updateUser, loggedIn: false})
                this.setState({forceLogoutAccountMessage: true})
            }
            ui.setFormSubmitting(false)
        })
    }

    _handleCancel = e => {
        e.preventDefault()
        const {users, ui} = this.props
        users.setUpdateUser({})
        ui.setActiveAdminModal('')
        ui.setErrorMessages([])
        this.setState({unlockAccountMessage: false})
        this.setState({forceLogoutAccountMessage: false})
    }

    _handleSave = e => {
        e.preventDefault()

        const {users, ui} = this.props
        const {_id, username, password, firstName, lastName, company, email} = users.updateUser

        let messages = []

        if (!_id && isEmpty(username)) messages.push('Username is required')
        if (!_id && isEmpty(password)) messages.push('Password is required')
        if (!_id && password.length < 8) messages.push('Password must be at least 8 characters')
        if (isEmpty(firstName)) messages.push('First Name is required')
        if (isEmpty(lastName)) messages.push('Last Name is required')
        if (isEmpty(company)) messages.push('Company is required')
        if (isEmpty(email)) messages.push('Email is required')
        else if (!this._validateEmail(email)) messages.push('Email address is not valid')

        ui.setErrorMessages(messages)

        if (messages.length > 0) return

        ui.setFormSubmitting(true)

        if (!_id) {

            const data = {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                company: company,
                email: email
            }

            Meteor.call('users.new', data, (error, result) => {
                if (error) {
                    console.log(error)
                    messages.push(error.reason || error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('User was created')
                    users.setUpdateUser({})
                    ui.setActiveAdminModal('')
                    ui.setErrorMessages([])
                    this.setState({unlockAccountMessage: false})
                    this.setState({forceLogoutAccountMessage: false})
                }
                ui.setFormSubmitting(false)
            })

        } else {

            const data = {
                _id: _id,
                firstName: firstName,
                lastName: lastName,
                company: company,
                email: email
            }

            Meteor.call('users.update', data, (error, result) => {
                if (error) {
                    console.log(error)
                    messages.push(error.reason || error.message)
                    ui.setErrorMessages(messages)
                } else {
                    Alert.success('User was updated')
                    users.setUpdateUser({})
                    ui.setActiveAdminModal('')
                    ui.setErrorMessages([])
                    this.setState({unlockAccountMessage: false})
                    this.setState({forceLogoutAccountMessage: false})
                }
                ui.setFormSubmitting(false)
            })

        }

    }

    _handleOnChange = (event, data) => {
        const {users} = this.props
        users.setUpdateUser({...users.updateUser, [data.name]: data.value})
    }

    render() {

        const {users, ui} = this.props
        const {unlockAccountMessage, forceLogoutAccountMessage} = this.state

        const errorMessages = ui.errorMessages.slice()

        const {_id, username, password, firstName, lastName, company, email, accountLocked, loggedIn} = users.updateUser

        return (
            <Modal open={ui.activeAdminModal === 'usersNew'}>

                <Modal.Header><TAP translate={_id ? 'update_user' : 'add_user'}/></Modal.Header>

                <Modal.Content as={Form} loading={ui.formSubmitting} onSubmit={this._handleSave} id='theForm' error={errorMessages.length > 0} autoComplete='off'>

                    {_id ? <Form.Input name='_id' label='ID' defaultValue={_id} disabled/> : null}
                    <Form.Input name='username' label='Username' placeholder='Username' value={username || ''} onChange={this._handleOnChange} disabled={_id ? true : false}/>
                    {!_id ? <Form.Input name='password' label='Password' placeholder='Password' value={password || ''} onChange={this._handleOnChange} type='password'/> : null}
                    <Form.Input name='firstName' label='First Name' placeholder='First name' value={firstName || ''} onChange={this._handleOnChange}/>
                    <Form.Input name='lastName' label='Last Name' placeholder='Last name' value={lastName || ''} onChange={this._handleOnChange}/>
                    <Form.Input name='company' label='Company' placeholder='Company' value={company || ''} onChange={this._handleOnChange}/>
                    <Form.Input name='email' label='Email Address' placeholder='Email Address' value={email || ''} onChange={this._handleOnChange}/>

                    {accountLocked ? <Button onClick={this._handleUnlockAccount} content='Unlock Account' disabled={ui.formSubmitting}/> : null}
                    {unlockAccountMessage ? <Message info content='User account has been unlocked'/>: null}

                    {loggedIn ? <Button onClick={this._handleForceSignOut} content='Force Sign Out' disabled={ui.formSubmitting}/> : null}
                    {forceLogoutAccountMessage ? <Message info content='User account has been signed out'/> : null}

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