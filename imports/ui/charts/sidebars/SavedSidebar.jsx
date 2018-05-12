import React from 'react'
import {Grid, List, Sidebar} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

@inject('ui') @observer
export default class SavedSidebar extends React.Component {

    render() {

        const {visible} = this.props

        return (
            <Sidebar
                className='margin-240'
                width='wide'
                animation='overlay'
                direction='left'
                visible={visible}
            >

                <Grid columns={1} padded>
                    <Grid.Column>
                        <List verticalAlign='middle'>

                        </List>
                    </Grid.Column>
                </Grid>

            </Sidebar>
        )

    }

}