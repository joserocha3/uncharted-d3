import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'

export default class ForgotPassword extends React.Component {

    state = {
        username: null,
        error: false,
        loading: false,
        success: false
    }

    handle

    componentDidMount() {
        document.body.style.backgroundColor = '#00adc6'
        this.handle = Tracker.autorun(() => Meteor.userId() ? FlowRouter.go('/admin') : null)
    }

    componentWillUnmount() {
        document.body.style.backgroundColor = ''
        this.handle.stop()
    }

    _handleSubmit = e => {

        e.preventDefault()

        const {username} = this.state

        this.setState({loading: true, error: false, success: false})

        Meteor.call('users.forgotPassword', username, (error, result) => {
            if (error) {
                this.setState({loading: false, error: true})
            } else {
                this.setState({loading: false, success: true})
            }
        })

    }

    render() {

        const {error, success, loading, username} = this.state

        return (
            <Grid verticalAlign='middle' centered columns={2} style={{height: '100%'}}>
                <Grid.Column>
                    <Segment padded='very' textAlign='center'>
                        <Form onSubmit={this._handleSubmit} success={success} error={error}>

                            <Header as='h1' content={'Enter Your Username'}/>

                            <Form.Input
                                value={username || ''}
                                name='username'
                                className='sign-in-input'
                                placeholder='Username'
                                fluid
                                onChange={(event, data) => this.setState({username: data.value})}
                            />

                            <Message success content='Reset link sent to your email address.'/>
                            <Message error content='Something went wrong. Try again.'/>

                            <Button
                                type='submit'
                                content='Send Reset Link'
                                loading={loading}
                                disabled={loading}
                            />

                            <div style={{marginTop: 25, textAlign: 'center'}}>
                                <a style={{cursor: 'pointer'}} onClick={() => FlowRouter.go('/authenticate')}>
                                    Never mind, I remember now
                                </a>
                            </div>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        )

    }

}
