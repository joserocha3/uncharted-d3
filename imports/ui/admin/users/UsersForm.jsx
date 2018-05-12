import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import TAP from '../../common/TAP'

@inject('users') @observer
export default class UsersForm extends React.Component {

    componentDidMount() {
        const {users} = this.props
        users.startSubscription()
    }

    componentWillUnmount() {
        const {users} = this.props
        users.stopSubscription()
    }

    _handleSearch = e => {
        e.preventDefault()
        const {users} = this.props
        users.setAdminSelectedData()
    }

    _handleClear = e => {
        e.preventDefault()
        const {users} = this.props
        users.clearAdminVariables()
    }

    render() {

        const {users} = this.props

        return (
            <Form onSubmit={this._handleSubmit}>

                <Form.Select
                    label='Username'
                    value={users.adminSelectedUsernames}
                    onChange={(event, data, dat) => users.setUserAdminSelectedUsernames(data.value)}
                    name='username'
                    options={users.dropdownUsernameOptions}
                    search
                    multiple
                />

                <Form.Select
                    label='Email Address'
                    value={users.adminSelectedEmails}
                    onChange={(event, data) => users.setUserAdminSelectedEmails(data.value)}
                    name='email'
                    options={users.dropdownEmailOptions}
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