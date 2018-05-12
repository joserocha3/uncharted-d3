/*-------------------------------------------------------------------------*
 * Object name:   records.js
 * Created by:    Pablo Rocha
 * Creation date: 02/05/2017
 * Description:   Record store classes and methods
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #13    07/09/2017  Pablo Rocha  - Create recordsIncludingMissingData to supply charts with a list of
 *                                           records that include country/indicators combinations with now record.value
 * master  #7     07/09/2017  Pablo Rocha  - Remove call to method indicators.setColors
 *                                         - Allow recordsIncludingMissingData to be called from any route group
 *                                         - Subscribe to latestRecord, needed or Meteor.call('records.new') does not pull the latest record
 * master  #20    07/09/2017  Pablo Rocha  - Fix for recordsIncludingMissingData changing the profile year, changed = to ===
 * master  #18.1  07/12/2017  Pablo Rocha  - Call ui.setDisabled from setRecords so buttons are set after data loads
 * master  #24.1  07/13/2017  Pablo Rocha  - Do not pull back "bad" records with no "value"
 * master  #28.1  07/13/2017  Pablo Rocha  - setUpdateRecord needs to check the singleRecord subscription
 * master  #22.1  07/14/2017  Pablo Rocha  - Replace profileIcon with colorIcon and whiteIcon
 * master  #33.1  07/01/2017  Pablo Rocha  - Add *IndexType functionality
 *-------------------------------------------------------------------------*/

// Libs
import {action, autorun, computed, observable} from 'mobx'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {isEmpty, find, filter, sortBy} from 'lodash'
import moment from 'moment'

// Files
import {Records as database} from '../api/records'

class Records {

    @observable data = []
    @observable showDeleted = false
    @observable updateRecord = {}
    @observable countryIdsToFind = []
    @observable indexIdsToFind = []
    @observable pillarIdsToFind = []
    @observable subpillarIdsToFind = []
    @observable chartYear = 2016
    @observable profileYear = 2016
    @observable profileCountry = {}
    @observable profileIndexes = []
    @observable profilePillars = []
    @observable profileSubpillars = []
    @observable allYears = [2016, 2015] // TODO: fill this from database
    @observable loading = false
    @observable latestRecord = {}

    constructor() {
        let handle = Meteor.subscribe('latestRecord')
        Tracker.autorun(() => {
            if (handle.ready()) this.latestRecord = database.findOne({}, {sort: {_id: -1}})

        })
    }

    @action updateRecordsDataForAdmin = () => {

        this.data.replace([])

        this.handle = Meteor.subscribe('recordsForAdmin', this.showDeleted, this.countryIdsToFind.slice(), this.indexIdsToFind.slice(), this.pillarIdsToFind.slice(), this.subpillarIdsToFind.slice())

        Tracker.autorun(() => {
            if (this.handle.ready()) {
                this.setRecords(database.find({
                    $or: [
                        {country: {$in: this.countryIdsToFind.slice()}},
                        {index: {$in: this.indexIdsToFind.slice()}},
                        {pillar: {$in: this.pillarIdsToFind.slice()}},
                        {subpillar: {$in: this.subpillarIdsToFind.slice()}}
                    ],
                    year: {$gt: 2015},
                    delete: {$in: [null, false, this.showDeleted]}
                }, {sort: {year: 1}}).fetch())
            }
        })

    }

    @action updateRecordsDataForChart = () => {

        this.loading = true
        this.data.replace([])
        this.handle = Meteor.subscribe('recordsForChart', this.showDeleted, this.countryIdsToFind.slice(), this.indexIdsToFind.slice(), this.pillarIdsToFind.slice(), this.subpillarIdsToFind.slice(), this.chartYear)

        Tracker.autorun(() => {
            if (this.handle.ready()) {
                this.loading = false
                this.setRecords(database.find({
                    country: {$in: this.countryIdsToFind.slice()},
                    $or: [
                        {
                            index: {$in: this.indexIdsToFind.slice()},
                            pillar: null,
                            subpillar: null
                        },
                        {
                            pillar: {$in: this.pillarIdsToFind.slice()},
                            subpillar: null
                        },
                        {
                            subpillar: {$in: this.subpillarIdsToFind.slice()},
                        }
                    ],
                    value: {$exists: true, $ne: null},
                    year: this.chartYear,
                    delete: {$in: [null, false, this.showDeleted]}
                }, {sort: {year: 1}}).fetch())
            }
        })

    }

    @action updateRecordsDataForProfile = () => {

        this.data.replace([])

        this.handle = Meteor.subscribe('recordsForProfile', this.profileCountry._id, this.profileIndexes.slice(), this.profilePillars.slice(), this.profileSubpillars.slice(), this.profileYear)

        Tracker.autorun(() => {
            if (this.handle.ready()) {
                this.setRecords(database.find({
                    country: this.profileCountry._id,
                    $or: [
                        {
                            index: {$in: this.profileIndexes.slice()},
                            pillar: null,
                            subpillar: null
                        },
                        {
                            pillar: {$in: this.profilePillars.slice()},
                            subpillar: null
                        },
                        {
                            subpillar: {$in: this.profileSubpillars.slice()},
                        }
                    ],
                    year: this.profileYear,
                    delete: {$in: [null, false]}
                }, {sort: {year: 1}}).fetch())
            }
        })

    }

    @action setRecords = records => {

        this.data.replace(records.map(record => new Record(record)))

        stores.countries.setRecords(this.data.slice())
        stores.indicators.setRecords(this.data.slice())

        stores.ui.setDisabled()

    }

    @action setProfileIndexes = ids => this.profileIndexes.replace(ids)
    @action setProfilePillars = ids => this.profilePillars.replace(ids)
    @action setProfileSubpillars = ids => this.profileSubpillars.replace(ids)
    @action setProfileCountry = country => this.profileCountry = country

    @action setShowDeleted = checked => {
        this.showDeleted = checked
        this.setRecords(database.find({delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch())
    }

    @action setUpdateRecord = (record, lookUp) => {

        this.updateRecord = record

        if (isEmpty(this.updateRecord)) this.updateRecord = {}

        if (!lookUp) return

        let handle = Meteor.subscribe('singleRecord', this.updateRecord.country, this.updateRecord.index, this.updateRecord.pillar, this.updateRecord.subpillar, this.updateRecord.year)
        Tracker.autorun(() => {

            if (handle.ready()) {

                let recordObject
                if (this.updateRecord.subpillar) {

                    recordObject = database.findOne({
                        country: this.updateRecord.country,
                        index: this.updateRecord.index,
                        pillar: this.updateRecord.pillar,
                        subpillar: this.updateRecord.subpillar,
                        year: this.updateRecord.year,
                    })

                } else if (this.updateRecord.pillar) {

                    recordObject = database.findOne({
                        country: this.updateRecord.country,
                        index: this.updateRecord.index,
                        pillar: this.updateRecord.pillar,
                        $or: [{subpillar: null}, {subpillar: {$exists: false}}],
                        year: this.updateRecord.year
                    })

                } else {

                    recordObject = database.findOne({
                        country: this.updateRecord.country,
                        index: this.updateRecord.index,
                        $or: [{pillar: null}, {pillar: {$exists: false}}],
                        $or: [{subpillar: null}, {subpillar: {$exists: false}}],
                        year: this.updateRecord.year
                    })

                }

                if (recordObject) {
                    this.updateRecord = recordObject
                }

            }

        })

    }

    @action setCountryIdsToFind = ids => this.countryIdsToFind = ids
    @action setIndexIdsToFind = ids => this.indexIdsToFind = ids
    @action setPillarIdsToFind = ids => this.pillarIdsToFind = ids
    @action setSubpillarIdsToFind = ids => this.subpillarIdsToFind = ids
    @action setChartYear = year => this.chartYear = year
    @action setProfileYear = year => this.profileYear = year

    @computed get recordsIncludingMissingData() {

        const indexType = FlowRouter.current().route.group.name === 'chart' ?
                stores.indicators.chartIndexType :
                stores.indicators.profileIndexType;

        // Determine what year we need to use, since this method is only used for charts pass back records.chartYear
        const year = this.chartYear

        // Get every country and indicator combination

        const countriesAndIndicators = []

        stores.countries.data.filter(c => c.active).forEach(c => {

            const country = {}

            country.countryId = c._id
            country.countryColor = c.color
            country.countryName = stores.ui.language === 'ar' ? c.nameAr : c.nameEn
            country.sortName1 = c.nameEn
            country.countryDraw = c.draw

            const profile = c.profiles.find(c => c.year === year) || {}
            country.population = profile.totalPopulation || 0

            stores.indicators.data.filter(i => i.active && i.indexType === indexType).forEach(i => {

                const indicator = {}

                indicator.indicatorId = i._id
                indicator.indicatorColor = i.color
                indicator.indicatorName = stores.ui.language === 'ar' ? i.nameAr : i.nameEn
                indicator.sortName2 = i.nameEn
                indicator.indicatorDraw = i.draw
                indicator.colorIcon = i.colorIcon
                indicator.whiteIcon = i.whiteIcon

                countriesAndIndicators.push({...country, ...indicator})

            })
        })

        // Now fill in the record data for each combination, some may not have a record so pass
        // all nulls to countriesAndIndicators

        const recordsFound = []

        countriesAndIndicators.forEach(countryAndIndicator => {

            let record = stores.records.data.find(record => (
                record.year === year &&
                record.country === countryAndIndicator.countryId &&
                record.indicatorId === countryAndIndicator.indicatorId
            ))

            if (record) {
                countryAndIndicator.country = record.country
                countryAndIndicator.index = record.index || null
                countryAndIndicator.pillar = record.pillar || null
                countryAndIndicator.subpillar = record.subpillar || null
                countryAndIndicator.value = record.value
                countryAndIndicator.year = record.year
            } else {
                countryAndIndicator.country = null
                countryAndIndicator.index = null
                countryAndIndicator.pillar = null
                countryAndIndicator.subpillar = null
                countryAndIndicator.value = null
                countryAndIndicator.year = year // set this to use in sorting
            }

            recordsFound.push(countryAndIndicator)

        })

        // All done, so sort the records we have gathered
        const sortedRecords = sortBy(recordsFound, ['year', 'sortName1', 'sortName2'])

        // Filter based on legend selections - do this after setting the colors so the colors don't change when selecting/deselecting from the legend
        const recordsToReturn = sortedRecords.filter(r => r.countryDraw && r.indicatorDraw)

        // All done, return the records we have gathered and sorted
        return recordsToReturn

    }

    @computed get recordsWithCountryAndIndicatorData() {

        let year = 0
        let indexType = ''
        let data = []
        let records = []

        switch (FlowRouter.current().route.group.name) {
            case 'chart':
                year = this.chartYear
                indexType = stores.indicators.chartIndexType
                data = filter(this.data.slice(), {year: year})
                break
            case 'profile':
                year = this.profileYear
                indexType = stores.indicators.profileIndexType
                data = filter(this.data.slice(), {year: year})
                break
            default:
                console.log(FlowRouter.current().route.group.name)
                return []
        }

        data.forEach(record => {

            const country = find(stores.countries.data.slice(), {_id: record.country})
            const indicator = find(stores.indicators.data.slice().filter(i => i.indexType === indexType), {_id: record.subpillar || record.pillar || record.index})

            if (!country || !indicator) return

            record.countryId = record.country
            record.countryColor = country.color
            record.countryName = stores.ui.language === 'ar' ? country.nameAr : country.nameEn
            record.sortName1 = country.nameEn
            record.countryDraw = country.draw

            record.indicatorId = record.subpillar || record.pillar || record.index
            record.indicatorColor = indicator.color
            record.indicatorName = stores.ui.language === 'ar' ? indicator.nameAr : indicator.nameEn
            record.sortName2 = indicator.nameEn
            record.indicatorDraw = indicator.draw
            record.colorIcon = indicator.colorIcon
            record.whiteIcon = indicator.whiteIcon
            record.indexType = indicator.indexType

            record.value = record.value || 0

            const profile = find(country.profiles, {'year': record.year}) || {}

            record.population = profile.totalPopulation || 0

            records.push(record)

        })

        const sortedRecords = sortBy(records, ['year', 'sortName1', 'sortName2'])

        // Filter based on legend selections - do this after setting the colors so the colors don't change when selecting/deselecting from the legend

        switch (FlowRouter.current().route.group.name) {
            case 'chart':
                const recordsToDraw = filter(sortedRecords, {countryDraw: true, indicatorDraw: true})
                return recordsToDraw
            case 'profile':
                return sortedRecords
            default:
                console.log(FlowRouter.current().route.group.name)
                return []
        }

    }

}

class Record {

    constructor(record) {

        this._id = record._id
        this.country = record.country
        this.countryId = record.country
        this.index = record.index || null
        this.pillar = record.pillar || null
        this.subpillar = record.subpillar || null
        this.indicatorId = this.subpillar || this.pillar || this.index
        this.year = record.year
        this.value = record.value
        this.createdBy = record.createdBy
        this.changedBy = record.changedBy
        this.createdAt = record.createdAt ? moment(record.createdAt).format('lll') : null
        this.changedAt = record.changedAt ? moment(record.changedAt).format('lll') : null

    }

}

export default new Records()