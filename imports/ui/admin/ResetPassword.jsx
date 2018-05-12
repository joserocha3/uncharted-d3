import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {inject, observer} from 'mobx-react'
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'

@inject('users') @observer
export default class ResetPassword extends React.Component {

    state = {
        password: null,
        errorOccurred: false,
        errorMessage: 'Something went wrong. Try again.',
        loading: false
    }

    handle

    componentDidMount() {

        const {users} = this.props

        if (!users.resetPasswordToken) FlowRouter.go('/authenticate')

        document.body.style.backgroundColor = '#00adc6'
        this.handle = Tracker.autorun(() => Meteor.userId() ? FlowRouter.go('/admin') : null)

    }

    componentWillUnmount() {
        document.body.style.backgroundColor = ''
        this.handle.stop()
    }

    _handleSubmit = e => {

        e.preventDefault()

        const {users} = this.props
        const {password} = this.state

        if (!password) {
            this.setState({errorMessage: 'Password cannot be blank', errorOccurred: true, loading: false})
            return
        } else if (password.length < 8) {
            this.setState({errorMessage: 'Password must be at least 8 characters', errorOccurred: true, loading: false})
            return
        }

        this.setState({loading: true, errorOccurred: false})

        Accounts.resetPassword(users.resetPasswordToken, password, error => {
            console.log(error)
            if (error) {
                this.setState({errorMessage: error.reason || error.message, errorOccurred: true, loading: false})
            } else {
                FlowRouter.go('/admin')
            }
        })

    }

    render() {

        const {errorOccurred, errorMessage, loading, password} = this.state

        return (
            <Grid verticalAlign='middle' centered columns={2} style={{height: '100%'}}>
                <Grid.Column>
                    <Segment padded='very' textAlign='center'>
                        <Form onSubmit={this._handleSubmit} error={errorOccurred}>

                            <Header as='h1' content={'Enter a New Password'}/>

                            <Form.Input
                                value={password || ''}
                                name='password'
                                type='password'
                                className='sign-in-input'
                                placeholder='New password'
                                fluid
                                onChange={(event, data) => this.setState({password: data.value})}
                            />

                            <Message error content={errorMessage}/>

                            <Button
                                type='submit'
                                content='Reset Password'
                                loading={loading}
                                disabled={loading}
                            />

                            <div style={{marginTop: 25, textAlign: 'center'}}>
                                <a style={{cursor: 'pointer'}} onClick={() => FlowRouter.go('/forgotPassword')}>
                                    Request another reset link
                                </a>
                            </div>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        )

    }

}
