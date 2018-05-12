/*-------------------------------------------------------------------------*
 * Object name:   countries.js
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Countries store classes and methods
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #18.1  07/12/2017  Pablo Rocha  - Add drawIds method for ui.setDisabled call
 *-------------------------------------------------------------------------*/

// Libs
import {action, autorun, computed, observable} from 'mobx'
import {map, size, forEach, filter, find, union, isEmpty, isNumber, startsWith, sortBy} from 'lodash'
import moment from 'moment'

// Files
import {Countries as database} from '../api/countries'

class Countries {

    @observable data = []
    @observable showDeleted = false
    @observable selectedCountryIds = []
    @observable selectedIsoIds = []
    @observable countryIdsToDisplay = []
    @observable updateCountry = {}
    @observable updateCountryProfile = {}

    /*
     *  Country initialization
     */

    constructor() {

        this.handle = Meteor.subscribe('countries');

        Tracker.autorun(() => {
            if (this.handle.ready()) this.setCountries(database.find({delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch())
        })

    }

    @action setCountries = countries => {

        this.data.replace(
            map(countries, country => {
                return new Country(country)
            })
        )

        if (size(this.data.slice()) > 0)
            stores.records.setProfileCountry(this.data[0])

    }

    @action setShowDeleted = checked => {
        this.showDeleted = checked
        this.setCountries(database.find({delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch())
    }

    /*
     *  Country items for chart sidebar
     */

    @action toggleActive = _id => {
        forEach(this.data, country => {
                if (country._id === _id) {
                    country.active = !country.active
                    country.draw = country.active
                }
            }
        )
    }

    @action toggleDraw = _id => {
        forEach(this.data, country => {
                if (country._id === _id) {
                    country.draw = !country.draw
                }
            }
        )
    }

    @action activateAll = (active = true) => {
        forEach(this.data, country => {
            country.active = active
            country.draw = active
        })
    }

    @action setRecords = records => {
        forEach(filter(this.data.slice(), 'active'), country => {
            if (find(records, {countryId: country._id})) {
                country.records = true
            } else {
                country.records = false
            }
        })
    }

    @computed get activeIds() {
        return map(filter(this.data, 'active'), country => country._id)
    }

    @computed get drawAndRecordsIds() {
        return map(filter(this.data, {draw: true, records: true}), country => country._id)
    }

    /*
     * Country drop down items for admin
     */

    @action setSelectedCountryIds = ids => {
        this.selectedCountryIds.replace(ids)
    }

    @action setSelectedIsoIds = ids => {
        this.selectedIsoIds.replace(ids)
    }

    @action setCountryIdsToDisplay = () => {
        this.countryIdsToDisplay.replace(
            union(this.selectedCountryIds, this.selectedIsoIds)
        )
    }

    @computed get dropdownCountryOptions() {
        return map(this.data, country => ({key: country._id, text: country.nameEn, value: country._id}))
    }

    @computed get dropdownIsoOptions() {
        return map(this.data, country => ({key: country._id, text: country.iso, value: country._id}))
    }

    /*
     * Country object for update country modal
     */

    @action setUpdateCountryProfile = (_id, profile, lookUp) => {
        this.updateCountryProfile = {...profile, _id}

        if (isEmpty(this.updateCountryProfile)) this.updateCountryProfile = {}

        if (lookUp && !isEmpty(this.updateCountryProfile._id) && isNumber(this.updateCountryProfile.year)) {
            const country = find(this.data, {_id: this.updateCountryProfile._id})
            if (country) {
                const profile = find(country.profiles, {year: this.updateCountryProfile.year})
                if (profile) {
                    this.updateCountryProfile = {...profile}
                    this.updateCountryProfile._id = country._id
                    this.updateCountryProfile.update = true
                } else {
                    const emptyProfile = {}
                    emptyProfile._id = this.updateCountryProfile._id
                    emptyProfile.year = this.updateCountryProfile.year
                    this.updateCountryProfile = emptyProfile
                    this.updateCountryProfile.update = false
                }
            }
        }
    }

    @action setUpdateCountry = data => {
        this.updateCountry = {...data}
    }

}

class Country {

    @observable draw
    @observable active
    @observable records

    constructor(country) {

        this._id = country._id
        this.nameEn = country.nameEn
        this.nameAr = country.nameAr || country.nameEn
        this.iso = country.iso
        this.flag = country.flag
        this.color = startsWith(country.color, '#') ? country.color : '#' + country.color
        this.profileHeader = country.profileHeader
        this.profileMap = country.profileMap
        this.createdAt = moment(country.createdAt).format('lll')
        this.createdBy = country.createdBy
        this.changedAt = moment(country.changedAt).format('lll')
        this.changedBy = country.changedBy
        this.deleted = country.deleted
        this.draw = false
        this.active = false
        this.records = false

        this.profiles = map(sortBy(country.profiles, 'year'), profile => new Profile(profile))

        this.populations = sortBy(country.populations, 'year')

        forEach(this.populations, population => {
            population.createdAt = moment(population.createdAt).format('lll')
            population.changedAt = moment(population.changedAt).format('lll')
        })

    }

}

class Profile {

    constructor(profile) {

        this.year = profile.year
        this.area = profile.area
        this.totalPopulation = profile.totalPopulation
        this.populationGrowthRate = profile.populationGrowthRate
        this.percentageOfYouth = profile.percentageOfYouth
        this.gdp = profile.gdp
        this.gdpPerCapita = profile.gdpPerCapita
        this.gdpGrowthRate = profile.gdpGrowthRate
        this.lifeExpectancyAtBirth = profile.lifeExpectancyAtBirth
        this.youthLiteracyRate = profile.youthLiteracyRate
        this.youthUnemploymentRate = profile.youthUnemploymentRate
        this.overview = profile.overview
        this.ar_overview = profile.ar_overview

        this.createdBy = profile.createdBy
        this.changedBy = profile.changedBy

        this.createdAt = profile.createdAt = moment(profile.createdAt).format('lll')
        this.changedAt = profile.changedAt = moment(profile.changedAt).format('lll')

    }

}

export default new Countries()