import React from 'react'
import {Meteor} from 'meteor/meteor'
import {Button, Form, Message, Modal} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {isEmpty, isUndefined, isNaN, omit, times} from 'lodash'
import Alert from 'react-s-alert'

import TAP from '../../common/TAP'

@inject('countries', 'ui') @observer
export default class CountryProfileModal extends React.Component {

    _handleCancel = e => {
        e.preventDefault()
        const {countries, ui} = this.props
        countries.setUpdateCountryProfile(null, null)
        ui.setActiveAdminModal('')
        ui.setErrorMessages([])
    }

    _handleSave = e => {
        e.preventDefault()

        const {countries, ui} = this.props

        let messages = []

        if (isEmpty(countries.updateCountryProfile._id)) messages.push('Country is required')
        if (isUndefined(countries.updateCountryProfile.year)) messages.push('Year is required')
        if (isUndefined(countries.updateCountryProfile.area)) messages.push('Area is required')
        if (isUndefined(countries.updateCountryProfile.totalPopulation)) messages.push('Total Population is required')
        if (isUndefined(countries.updateCountryProfile.populationGrowthRate)) messages.push('Population Growth Rate is required')
        if (isUndefined(countries.updateCountryProfile.gdp)) messages.push('GDP is required')
        if (isUndefined(countries.updateCountryProfile.gdpPerCapita)) messages.push('GDP Per Capita is required')
        if (isUndefined(countries.updateCountryProfile.gdpGrowthRate)) messages.push('GDP Growth Rate is required')
        if (isUndefined(countries.updateCountryProfile.percentageOfYouth)) messages.push('Percentage Of Youth is required')
        if (isUndefined(countries.updateCountryProfile.youthLiteracyRate)) messages.push('Youth Literacy Rate is required')
        if (isUndefined(countries.updateCountryProfile.youthUnemploymentRate)) messages.push('Youth Unemployment Rate is required')
        if (isUndefined(countries.updateCountryProfile.lifeExpectancyAtBirth)) messages.push('Life Expectancy At Birth is required')
        if (isEmpty(countries.updateCountryProfile.overview)) messages.push('Overview EN is required')
        if (isEmpty(countries.updateCountryProfile.ar_overview)) messages.push('Overview AR is required')

        countries.updateCountryProfile.year = parseFloat(countries.updateCountryProfile.year)
        countries.updateCountryProfile.area = parseFloat(countries.updateCountryProfile.area)
        countries.updateCountryProfile.totalPopulation = parseFloat(countries.updateCountryProfile.totalPopulation)
        countries.updateCountryProfile.populationGrowthRate = parseFloat(countries.updateCountryProfile.populationGrowthRate)
        countries.updateCountryProfile.gdp = parseFloat(countries.updateCountryProfile.gdp)
        countries.updateCountryProfile.gdpPerCapita = parseFloat(countries.updateCountryProfile.gdpPerCapita)
        countries.updateCountryProfile.gdpGrowthRate = parseFloat(countries.updateCountryProfile.gdpGrowthRate)
        countries.updateCountryProfile.percentageOfYouth = parseFloat(countries.updateCountryProfile.percentageOfYouth)
        countries.updateCountryProfile.youthLiteracyRate = parseFloat(countries.updateCountryProfile.youthLiteracyRate)
        countries.updateCountryProfile.youthUnemploymentRate = parseFloat(countries.updateCountryProfile.youthUnemploymentRate)
        countries.updateCountryProfile.lifeExpectancyAtBirth = parseFloat(countries.updateCountryProfile.lifeExpectancyAtBirth)

        if (isNaN(countries.updateCountryProfile.year)) messages.push('Year must be numeric')
        if (isNaN(countries.updateCountryProfile.area)) messages.push('Area must be numeric')
        if (isNaN(countries.updateCountryProfile.totalPopulation)) messages.push('Total population must be numeric')
        if (isNaN(countries.updateCountryProfile.populationGrowthRate)) messages.push('Population Growth Rate must be numeric')
        if (isNaN(countries.updateCountryProfile.gdp)) messages.push('GDP must be numeric')
        if (isNaN(countries.updateCountryProfile.gdpPerCapita)) messages.push('GDP Per Capita must be numeric')
        if (isNaN(countries.updateCountryProfile.gdpGrowthRate)) messages.push('GDP Growth Rate must be numeric')
        if (isNaN(countries.updateCountryProfile.percentageOfYouth)) messages.push('Percentage Of Youth must be numeric')
        if (isNaN(countries.updateCountryProfile.youthLiteracyRate)) messages.push('Youth Literacy Rate must be numeric')
        if (isNaN(countries.updateCountryProfile.youthUnemploymentRate)) messages.push('Youth Unemployment Rate must be numeric')
        if (isNaN(countries.updateCountryProfile.lifeExpectancyAtBirth)) messages.push('Life Expectancy At Birth must be numeric')

        ui.setErrorMessages(messages)

        if (messages.length > 0) return

        ui.setFormSubmitting(true)

        const data = omit(countries.updateCountryProfile, ['_id', 'country', 'country-search', 'year-search', 'update', 'countryId', 'countryName', 'createdBy', 'createdAt', 'changedBy', 'changedAt'])

        Meteor.call('countries.year.save', countries.updateCountryProfile._id, data, (error, result) => {
            if (error) {
                messages.push(error.message)
                ui.setErrorMessages(messages)
            } else {
                Alert.success('Country profile was saved')
                ui.setActiveAdminModal('')
                ui.setErrorMessages([])
                countries.setUpdateCountryProfile(null, null)
            }
            ui.setFormSubmitting(false)
        })

    }

    _handleOnChange = (event, data) => {
        const {countries} = this.props
        switch (data.name) {
            case 'country':
                countries.setUpdateCountryProfile(data.value, {...countries.updateCountryProfile, year: countries.updateCountryProfile.year}, true)
                break
            case 'year':
                countries.setUpdateCountryProfile(countries.updateCountryProfile._id, {...countries.updateCountryProfile, year: data.value}, true)
                break
            case 'overview':
            case 'ar_overview':
                countries.setUpdateCountryProfile(countries.updateCountryProfile._id, {...countries.updateCountryProfile, [data.name]: data.value})
                break
            default:
                const profile = {...countries.updateCountryProfile, [data.name]: parseFloat(data.value)}
                countries.setUpdateCountryProfile(countries.updateCountryProfile._id, profile)
                break
        }
    }

    render() {

        const {countries, ui} = this.props

        const errorMessages = ui.errorMessages.slice()

        const years = times(18, i => ({key: 2000 + i, text: 2000 + i, value: 2000 + i}))

        const {
            _id, year, area, totalPopulation, populationGrowthRate, gdp, gdpPerCapita, gdpGrowthRate, percentageOfYouth,
            youthLiteracyRate, youthUnemploymentRate, lifeExpectancyAtBirth, overview, ar_overview
        } = countries.updateCountryProfile

        const update = countries.updateCountryProfile.update

        return (
            <Modal open={ui.activeAdminModal === 'countryProfileNew'}>

                <Modal.Header><TAP translate={update ? 'update_record' : 'add_record'}/></Modal.Header>

                <Modal.Content as={Form} loading={ui.formSubmitting} onSubmit={this._handleSave} id='theForm' error={errorMessages.length > 0}>
                    {update ? <Form.Input name='_id' label='ID' defaultValue={countries.updateCountryProfile._id} disabled/> : null}
                    <Form.Group widths='equal'>
                        <Form.Select search name='country' label='Country' placeholder='Country' value={_id || ''} options={countries.dropdownCountryOptions || ''} onChange={this._handleOnChange} disabled={update}/>
                        <Form.Select search name='year' label='Year' placeholder='Year' value={year || ''} options={years || ''} onChange={this._handleOnChange} disabled={update}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input type='number' step='any' name='area' label='Area' placeholder='Area' value={area || ''} onChange={this._handleOnChange}/>
                        <Form.Input type='number' step='any' name='totalPopulation' label='Total Population' placeholder='Total Population' value={totalPopulation || ''} onChange={this._handleOnChange}/>
                        <Form.Input type='number' step='any' name='populationGrowthRate' label='Population Growth Rate' placeholder='Population Growth Rate' value={populationGrowthRate || ''} onChange={this._handleOnChange}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input type='number' step='any' name='gdp' label='GDP' placeholder='GDP' value={gdp || ''} onChange={this._handleOnChange}/>
                        <Form.Input type='number' step='any' name='gdpPerCapita' label='GDP Per Capita' placeholder='GDP Per Capita' value={gdpPerCapita || ''} onChange={this._handleOnChange}/>
                        <Form.Input type='number' step='any' name='gdpGrowthRate' label='GDP Growth Rate' placeholder='GDP Growth Rate' value={gdpGrowthRate || ''} onChange={this._handleOnChange}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input type='number' step='any' name='percentageOfYouth' label='Percentage Of Youth (15-24 years)' placeholder='Percentage Of Youth (15-24 years)' value={percentageOfYouth || ''} onChange={this._handleOnChange}/>
                        <Form.Input type='number' step='any' name='youthLiteracyRate' label='Youth Literacy Rate (15-24 years)' placeholder='Youth Literacy Rate (15-24 years)' value={youthLiteracyRate || ''} onChange={this._handleOnChange}/>
                        <Form.Input type='number' step='any' name='youthUnemploymentRate' label='Youth Unemployment Rate (15-24 years)' placeholder='Youth Unemployment Rate (15-24 years)' value={youthUnemploymentRate || ''} onChange={this._handleOnChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Input type='number' step='any' name='lifeExpectancyAtBirth' label='Life Expectancy At Birth' placeholder='Life Expectancy At Birth' value={lifeExpectancyAtBirth || ''} onChange={this._handleOnChange}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.TextArea name='overview' label='Overview EN' placeholder='Overview EN' value={overview || ''} onChange={this._handleOnChange}/>
                        <Form.TextArea name='ar_overview' label='Overview AR' placeholder='Overview AR' value={ar_overview || ''} onChange={this._handleOnChange}/>
                    </Form.Group>
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