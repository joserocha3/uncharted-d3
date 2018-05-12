import React from 'react'
import {Meteor} from 'meteor/meteor'
import {inject, observer} from 'mobx-react'
import {Button, Form, Grid, Header, Sidebar, Segment} from 'semantic-ui-react'

import NavigationMenu from '../admin/NavigationMenu'
import AdminMenu from '../admin/AdminMenu'
import CountriesNewModal from '../admin/countries/CountriesNewModal'
import CountriesUpdateModal from '../admin/countries/CountriesUpdateModal'
import CountryProfileModal from '../admin/countryProfile/CountryProfileModal'
import IndicatorIndexModal from '../admin/index/IndicatorIndexModal'
import IndicatorPillarModal from '../admin/pillar/IndicatorPillarModal'
import IndicatorSubpillarModal from '../admin/subpillar/IndicatorSubpillarModal'
import RecordsModal from '../admin/records/RecordsModal'
import UsersModal from '../admin/users/UsersModal'
import TAP from '../common/TAP'

@inject('ui') @observer
export default class AdminLayout extends React.Component {

    handle

    componentDidMount() {
        this.handle = Tracker.autorun(() => {
            if (!Meteor.userId()) FlowRouter.go('authenticate');
        })
    }

    componentWillUnmount() {
        this.handle.stop()
    }

    render() {

        const {form, table, ui} = this.props

        const adminForm = form === null ?
            <div id='admin-form'/> :
            <div id='admin-form'>

                <Segment color='teal'>
                    <Header><TAP translate='filter'/></Header>
                    {form}
                </Segment>

                <Segment clearing attached='top'>

                    <Header><TAP translate='tabular_view'/></Header>

                    <Grid columns={2} verticalAlign='middle'>

                        <Grid.Column>
                            <Form>
                                <Form.Field>
                                    <label>Show Columns</label>
                                    <Form.Group inline>
                                        <Form.Checkbox label='ID' onChange={(event, data) => ui.setShowIdColumn(data.checked)}/>
                                        <Form.Checkbox label='Created' onChange={(event, data) => ui.setShowCreatedColumns(data.checked)}/>
                                        <Form.Checkbox label='Changed' onChange={(event, data) => ui.setShowChangedColumns(data.checked)}/>
                                        <Form.Checkbox label='Delete' onChange={(event, data) => ui.setShowDeleteColumn(data.checked)}/>
                                    </Form.Group>
                                </Form.Field>
                            </Form>
                        </Grid.Column>

                        <Grid.Column>
                            <Button color='blue' content={<TAP translate='add_record'/>} icon='add' floated='right' onClick={(event, data) => ui.setActiveAdminModal(ui.activeAdminMenuItem + 'New')}/>
                        </Grid.Column>

                    </Grid>

                </Segment>

                <div className='admin-table'>
                    {table}
                </div>

            </div>

        return (
            <div id='admin-layout'>

                <NavigationMenu/>

                <Sidebar.Pushable>
                    <Sidebar.Pusher>
                        <AdminMenu/>
                        {adminForm}
                        <CountriesNewModal/>
                        <CountriesUpdateModal/>
                        <CountryProfileModal/>
                        <IndicatorIndexModal/>
                        <IndicatorPillarModal/>
                        <IndicatorSubpillarModal/>
                        <RecordsModal/>
                        <UsersModal/>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>

            </div>
        )

    }

}