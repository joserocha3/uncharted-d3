/*-------------------------------------------------------------------------*
 * Object name:   router.js
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   All routes for the app are defined here using FlowRouter
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #15.1  06/14/2017  Pablo Rocha  - Add line chart route
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {Meteor} from 'meteor/meteor'
import {mount} from 'react-mounter'

// Components
import MainLayout from '../../ui/layouts/MainLayout'
import SponsorsLayout from '../../ui/layouts/SponsorsLayout'
import InfographicLayout from '../../ui/layouts/InfographicLayout'
import ProfileLayout from '../../ui/layouts/ProfileLayout'
import ChartLayout from '../../ui/layouts/ChartLayout'
import AdminLayout from '../../ui/layouts/AdminLayout'
import Authenticate from '../../ui/admin/Authenticate'
import ForgotPassword from '../../ui/admin/ForgotPassword'
import ResetPassword from '../../ui/admin/ResetPassword'
import CountriesForm from '../../ui/admin/countries/CountriesForm'
import CountriesTable from '../../ui/admin/countries/CountriesTable'
import CountryProfileForm from '../../ui/admin/countryProfile/CountryProfileForm'
import CountryProfileTable from '../../ui/admin/countryProfile/CountryProfileTable'
import IndicatorIndexForm from '../../ui/admin/index/IndicatorIndexForm'
import IndicatorIndexTable from '../../ui/admin/index/IndicatorIndexTable'
import IndicatorPillarForm from '../../ui/admin/pillar/IndicatorPillarForm'
import IndicatorPillarTable from '../../ui/admin/pillar/IndicatorPillarTable'
import IndicatorSubpillarForm from '../../ui/admin/subpillar/IndicatorSubpillarForm'
import IndicatorSubpillarTable from '../../ui/admin/subpillar/IndicatorSubpillarTable'
import RecordsForm from '../../ui/admin/records/RecordsForm'
import RecordsTable from '../../ui/admin/records/RecordsTable'
import UsersForm from '../../ui/admin/users/UsersForm'
import UsersTable from '../../ui/admin/users/UsersTable'

// Files
import stores from '../../stores/stores'

const ui = stores.ui
const countries = stores.countries
const indicators = stores.indicators
const records = stores.records
const users = stores.users

// region Infographic routes

/*
 *
 * English infographic routes
 *
 */

const infographicRoutes = FlowRouter.group({
    prefix: '/en/infographic',
    triggersEnter: [() => {
        ui.setLanguage('en')
        ui.navigationMenuItemClicked('infographic')
    }]
})

infographicRoutes.route('/', {
    action() {
        mount(MainLayout, {content: <InfographicLayout/>})
    }
})

/*
 *
 * Arabic infographic routes
 *
 */

const arInfographicRoutes = FlowRouter.group({
    prefix: '/ar/infographic',
    triggersEnter: [() => {
        ui.setLanguage('ar')
        ui.navigationMenuItemClicked('infographic')
    }]
})

arInfographicRoutes.route('/', {
    action() {
        mount(MainLayout, {content: <InfographicLayout/>})
    }
})

// endregion

// region Sponsors routes

/*
 *
 * English profile routes
 *
 */

const sponsorsRoutes = FlowRouter.group({
    prefix: '/en/sponsors',
    triggersEnter: [() => {
        ui.setLanguage('en')
        ui.navigationMenuItemClicked('sponsors')
    }]
})

sponsorsRoutes.route('/', {
    action() {
        mount(MainLayout, {content: <SponsorsLayout/>})
    }
})

/*
 *
 * Arabic profile routes
 *
 */

const arSponsorsRoutes = FlowRouter.group({
    prefix: '/ar/sponsors',
    triggersEnter: [() => {
        ui.setLanguage('ar')
        ui.navigationMenuItemClicked('sponsors')
    }]
})

arSponsorsRoutes.route('/', {
    action() {
        mount(MainLayout, {content: <SponsorsLayout language='ar'/>})
    }
})

// endregion

//region Profile routes

/*
 *
 * English profile routes
 *
 */

const profileRoutes = FlowRouter.group({
    name: 'profile',
    prefix: '/en/profile',
    triggersEnter: [() => {
        ui.setLanguage('en')
        ui.navigationMenuItemClicked('profile')
    }]
})

profileRoutes.route('/', {
    name: 'profile',
    action() {
        mount(MainLayout, {content: <ProfileLayout/>})
    }
})

/*
 *
 * Arabic profile routes
 *
 */

const arProfileRoutes = FlowRouter.group({
    name: 'profile',
    prefix: '/ar/profile',
    triggersEnter: [() => {
        ui.setLanguage('ar')
        ui.navigationMenuItemClicked('profile')
    }]
})

arProfileRoutes.route('/', {
    name: 'profile',
    action() {
        mount(MainLayout, {content: <ProfileLayout/>})
    }
})

// endregion

//region Chart routes

/*
 *
 * English chart routes
 *
 */

const chartRoutes = FlowRouter.group({
    name: 'chart',
    prefix: '/en/chart',
    triggersEnter: [() => {
        ui.setLanguage('en')
        ui.navigationMenuItemClicked('chart')
    }]
})

chartRoutes.route('/', {
    name: 'chart',
    action() {
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

chartRoutes.route('/bar', {
    name: 'bar',
    action() {
        ui.barDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('bar')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

chartRoutes.route('/line', {
    name: 'line',
    action() {
        ui.lineDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('line')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

chartRoutes.route('/radar', {
    name: 'radar',
    action() {
        ui.radarDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('radar')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

chartRoutes.route('/scatter', {
    name: 'scatter',
    action() {
        ui.scatterDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('scatter')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

/*
 *
 * Arabic chart routes
 *
 */

const arChartRoutes = FlowRouter.group({
    name: 'chart',
    prefix: '/ar/chart',
    triggersEnter: [() => {
        ui.setLanguage('ar')
        ui.navigationMenuItemClicked('chart')
    }]
})

arChartRoutes.route('/', {
    name: 'chart',
    action() {
        ui.chartMenuItemClicked('')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

arChartRoutes.route('/bar', {
    name: 'bar',
    action() {
        ui.barDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('bar')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

arChartRoutes.route('/line', {
    name: 'line',
    action() {
        ui.barDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('line')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

arChartRoutes.route('/radar', {
    name: 'radar',
    action() {
        ui.radarDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('radar')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

arChartRoutes.route('/scatter', {
    name: 'scatter',
    action() {
        ui.scatterDisabled ? FlowRouter.go('/en/chart') : ui.chartMenuItemClicked('scatter')
        mount(MainLayout, {content: <ChartLayout/>})
    }
})

// endregion

// region Authenticate routes

FlowRouter.triggers.enter(
    [(context, redirect) => {
        ui.setLanguage('en')
        if (Meteor.userId()) redirect('/admin/countries')
    }],
    {only: ['authenticate', 'forgotPassword', 'resetPassword']}
)

FlowRouter.route('/authenticate', {
    name: 'authenticate',
    action() {
        mount(MainLayout, {content: <Authenticate/>})
    }
})

FlowRouter.route('/forgotPassword', {
    name: 'forgotPassword',
    action() {
        mount(MainLayout, {content: <ForgotPassword/>})
    }
})

FlowRouter.route('/resetPassword/:token', {
    name: 'resetPassword',
    action(params, queryParams) {
        if (!params.token) FlowRouter.go('/authenticate')
        users.setResetPasswordToken(params.token)
        mount(MainLayout, {content: <ResetPassword/>})
    }
})

// endregion

// region Admin routes

const adminRoutes = FlowRouter.group({
    name: 'admin',
    prefix: '/admin',
    triggersEnter: [(context, redirect) => {

        if (!Meteor.userId()) redirect('/authenticate')

        ui.setLanguage('en')
        ui.setActiveAdminModal('')

        users.clearAdminVariables()

        countries.setSelectedCountryIds([])
        countries.setCountryIdsToDisplay([])

        indicators.setSelectedIndexIds([])
        indicators.setSelectedIndexTypes([])
        indicators.setIndexIdsToDisplay([])
        indicators.setSelectedPillarIds([])
        indicators.setPillarIdsToDisplay([])
        indicators.setSelectedSubpillarIds([])
        indicators.setSubpillarIdsToDisplay([])
        indicators.setShow2015(false)

    }]
})

adminRoutes.route('/', {
    action() {
        ui.adminMenuItemClicked('')
        mount(MainLayout, {content: <AdminLayout form={null}/>})
    }
})

adminRoutes.route('/countries', {
    action() {
        ui.adminMenuItemClicked('countries')
        mount(MainLayout, {content: <AdminLayout form={<CountriesForm/>} table={<CountriesTable/>}/>})
    }
})

adminRoutes.route('/countryProfile', {
    action() {
        ui.adminMenuItemClicked('countryProfile')
        mount(MainLayout, {content: <AdminLayout form={<CountryProfileForm/>} table={<CountryProfileTable/>}/>})
    }
})

adminRoutes.route('/indicatorIndex', {
    action() {
        ui.adminMenuItemClicked('indicatorIndex')
        mount(MainLayout, {content: <AdminLayout form={<IndicatorIndexForm/>} table={<IndicatorIndexTable/>}/>})
    }
})

adminRoutes.route('/indicatorPillar', {
    action() {
        ui.adminMenuItemClicked('indicatorPillar')
        mount(MainLayout, {content: <AdminLayout form={<IndicatorPillarForm/>} table={<IndicatorPillarTable/>}/>})
    }
})

adminRoutes.route('/indicatorSubpillar', {
    action() {
        ui.adminMenuItemClicked('indicatorSubpillar')
        mount(MainLayout, {content: <AdminLayout form={<IndicatorSubpillarForm/>} table={<IndicatorSubpillarTable/>}/>})
    }
})

adminRoutes.route('/records', {
    action() {
        ui.adminMenuItemClicked('records')
        mount(MainLayout, {content: <AdminLayout form={<RecordsForm/>} table={<RecordsTable/>}/>})
    }
})

adminRoutes.route('/users', {
    action() {
        ui.adminMenuItemClicked('users')
        mount(MainLayout, {content: <AdminLayout form={<UsersForm/>} table={<UsersTable/>}/>})
    }
})

// endregion

// region Other routes

FlowRouter.notFound = {
    action() {
        if (ui.language === 'en') FlowRouter.go('/en/chart')
        if (ui.language === 'ar') FlowRouter.go('/ar/chart')
    }
}

// endregion