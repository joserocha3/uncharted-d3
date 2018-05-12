import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'

export default class Authenticate extends React.Component {

    state = {
        username: null,
        password: null,
        errorOccurred: false,
        errorMessage: 'You have entered an invalid username and password. Try again.',
        loading: false
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

        const {username, password} = this.state

        this.setState({loading: true, errorOccurred: false})

        Meteor.loginWithPassword(username, password, (error) => {
            if (error) {
                this.setState({errorMessage: error.reason || error.message, errorOccurred: true, loading: false})
            } else {
                FlowRouter.go('/admin')
            }
        })

    }

    render() {

        const {errorOccurred, errorMessage, loading, username, password} = this.state

        return (
            <Grid verticalAlign='middle' centered columns={2} style={{height: '100%'}}>
                <Grid.Column>
                    <Segment padded='very' textAlign='center'>
                        <Form onSubmit={this._handleSubmit} error={errorOccurred}>

                            <Header as='h1' content={'Please Sign In'}/>

                            <Form.Input
                                value={username || ''}
                                name='username'
                                className='sign-in-input'
                                placeholder='Username'
                                fluid
                                onChange={(event, data) => this.setState({username: data.value})}
                            />

                            <Form.Input
                                value={password || ''}
                                name='password'
                                className='sign-in-input'
                                type='password'
                                placeholder='Password'
                                fluid
                                onChange={(event, data) => this.setState({password: data.value})}
                            />

                            <Message error content={errorMessage}/>

                            <Button
                                type='submit'
                                content='Sign In'
                                loading={loading}
                                disabled={loading}
                            />

                            <div style={{marginTop: 25, textAlign: 'center'}}>
                                <a style={{cursor: 'pointer'}} onClick={() => FlowRouter.go('/forgotPassword')}>
                                    Forgot your password?
                                </a>
                            </div>

                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        )

    }

}
