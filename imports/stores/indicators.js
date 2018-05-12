/*-------------------------------------------------------------------------*
 * Object name:   indicators.js
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Indicators store classes and methods
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Remove call to method setColors
 *                                         - Remove colors variable
 *                                         - Assign Index/Pillar/Subpillar color from database
 * master         07/09/2017  Pablo Rocha  - Assign Index/Pillar/Subpillar 2015 boolean from database
 *                                         - Remove get2015 boolean, we want to pull them all now and
 *                                           the individual component filter by year
 * master  #18.1  07/12/2017  Pablo Rocha  - Add drawIds method for ui.setDisabled call
 * master  #22.1  07/14/2017  Pablo Rocha  - Replace profileIcon with colorIcon and whiteIcon
 * master  #33.1  07/01/2017  Pablo Rocha  - Add *IndexType functionality
 * master  #33.3  07/01/2017  Pablo Rocha  - Fix collapseAll
 *-------------------------------------------------------------------------*/

// Libs
import {action, computed, observable, autorun} from 'mobx'
import {FlowRouter} from 'meteor/kadira:flow-router'
import {forEach, find, map, filter, sortBy} from 'lodash'
import moment from 'moment'

// Files
import {Indexes} from '../api/indexes'
import {Pillars} from '../api/pillars'
import {Subpillars} from '../api/subpillars'

class Indicators {

    @observable data = []
    @observable showDeleted = false
    @observable show2015 = false
    @observable updateIndex = {}
    @observable updatePillar = {}
    @observable updateSubpillar = {}
    @observable selectedIndexTypes = []
    @observable selectedIndexIds = []
    @observable selectedPillarIds = []
    @observable selectedSubpillarIds = []
    @observable indexTypesToDisplay = []
    @observable indexIdsToDisplay = []
    @observable pillarIdsToDisplay = []
    @observable subpillarIdsToDisplay = []
    @observable chartIndexType = 'KI'
    @observable profileIndexType = 'KI'

    /*
     *  Indicator initialization
     */

    constructor() {
        this.subscribe()
    }

    @action subscribe = () => {

        this.indexesHandle = Meteor.subscribe('indexes', this.show2015)
        this.pillarsHandle = Meteor.subscribe('pillars', this.show2015)
        this.subpillarsHandle = Meteor.subscribe('subpillars', this.show2015)

        Tracker.autorun(() => {
            if (this.indexesHandle.ready() &&
                this.pillarsHandle.ready() &&
                this.subpillarsHandle.ready()) {

                const groupName = FlowRouter.current().route.group ? FlowRouter.current().route.group.name : null

                if (groupName === 'admin') {
                    // Show both if show2015 is true
                    if (this.show2015) {
                        this.setIndicators(
                            Indexes.find({delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Pillars.find({delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Subpillars.find({delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                        )
                    } else {
                        this.setIndicators(
                            Indexes.find({2015: {$in: [null, false]}, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Pillars.find({2015: {$in: [null, false]}, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Subpillars.find({2015: {$in: [null, false]}, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                        )
                    }
                } else {
                    // Only show one or the other
                    if (this.show2015) {
                        this.setIndicators(
                            Indexes.find({2015: true, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Pillars.find({2015: true, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Subpillars.find({2015: true, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                        )
                    } else {
                        this.setIndicators(
                            Indexes.find({2015: {$in: [null, false]}, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Pillars.find({2015: {$in: [null, false]}, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                            Subpillars.find({2015: {$in: [null, false]}, delete: {$in: [null, false, this.showDeleted]}}, {sort: {nameEn: 1}}).fetch(),
                        )
                    }
                }

            }
        })

    }

    @action setIndicators = (indexes, pillars, subpillars) => {

        this.data.replace([])

        const indexTypeIds = []
        const pillarTypeIds = []
        const subpillarTypeIds = []

        forEach(indexes, index => {
            index.createdAt = index.createdAt ? moment(index.createdAt).format('lll') : null
            index.changedAt = index.changedAt ? moment(index.changedAt).format('lll') : null
            this.data.push(new Index(index))
            indexTypeIds.push(index._id)
        })

        forEach(pillars, pillar => {
            pillar.indexNameEn = find(indexes, {_id: pillar.index}).nameEn
            pillar.colorIcon = find(indexes, {_id: pillar.index}).colorIcon
            pillar.whiteIcon = find(indexes, {_id: pillar.index}).whiteIcon
            pillar.indexType = find(indexes, {_id: pillar.index}).indexType
            pillar.createdAt = pillar.createdAt ? moment(pillar.createdAt).format('lll') : null
            pillar.changedAt = pillar.changedAt ? moment(pillar.changedAt).format('lll') : null
            this.data.push(new Pillar(pillar))
            pillarTypeIds.push(pillar._id)
        })

        forEach(subpillars, subpillar => {
            subpillar.indexNameEn = find(indexes, {_id: subpillar.index}).nameEn
            subpillar.colorIcon = find(indexes, {_id: subpillar.index}).colorIcon
            subpillar.whiteIcon = find(indexes, {_id: subpillar.index}).whiteIcon
            subpillar.indexType = find(indexes, {_id: subpillar.index}).indexType
            subpillar.pillarNameEn = find(pillars, {_id: subpillar.pillar}).nameEn
            subpillar.createdAt = subpillar.createdAt ? moment(subpillar.createdAt).format('lll') : null
            subpillar.changedAt = subpillar.changedAt ? moment(subpillar.changedAt).format('lll') : null
            this.data.push(new Subpillar(subpillar))
            subpillarTypeIds.push(subpillar._id)
        })

        stores.records.setProfileIndexes(indexTypeIds)

        if (FlowRouter.current().route.group) {
            switch (FlowRouter.current().route.group.name) {
                case 'admin':
                    stores.records.updateRecordsDataForAdmin()
                    break
                case 'chart':
                    stores.records.updateRecordsDataForChart()
                    break
                default:
                    stores.records.updateRecordsDataForProfile()
                    break
            }
        }

    }

    @action setShowDeleted = checked => {
        this.showDeleted = checked
        this.subscribe()
    }
    @action setShow2015 = checked => {
        this.show2015 = checked
        this.subscribe()
    }

    _getPillarIdsForIndexId = id => map(filter(this.data.slice(), {type: 'pillar', index: id}), pillar => pillar._id)
    _getSubpillarIdsForPillarId = id => map(filter(this.data.slice(), {type: 'subpillar', pillar: id}), subpillar => subpillar._id)
    _getIndexIds = () => map(filter(this.data.slice(), {type: 'index'}), index => index._id)

    /*
     *  Indicator items for chart sidebar
     */

    @action toggleActive = _id => {
        forEach(this.data, indicator => {
                if (indicator._id === _id) {
                    indicator.active = !indicator.active
                    indicator.draw = indicator.active
                }
            }
        )
    }

    @action toggleDraw = _id => {
        forEach(this.data, indicator => {
                if (indicator._id === _id) {
                    indicator.draw = !indicator.draw
                }
            }
        )
    }

    @action activateAll = (active = true) => {
        forEach(this.data, indicator => {
            indicator.active = active
            indicator.draw = active
        })
    }

    @action toggleOpen = _id => {
        forEach(this.data, indicator => {
                if (indicator._id === _id) {
                    indicator.open = !indicator.open
                }
            }
        )
    }

    @action collapseAll = () => forEach(this.data, indicator => {
        indicator.open = false;
    })
    @action expandAll = () => forEach(this.data, indicator => {
        indicator.open = true;
    })

    @action setChartIndexType = indexType => this.chartIndexType = indexType
    @action setProfileIndexType = indexType => this.profileIndexType = indexType

    @computed get activeIds() {
        return map(filter(this.data, 'active'), indicator => indicator._id)
    }

    @computed get drawAndRecordsIds() {
        return map(filter(this.data, {draw: true, records: true}), indicator => indicator._id)
    }

    @computed get activeIndexIds() {
        return map(filter(this.data, {type: 'index', active: true}), indicator => indicator._id)
    }

    @computed get activePillarIds() {
        return map(filter(this.data, {type: 'pillar', active: true}), indicator => indicator._id)
    }

    @computed get activeSubpillarIds() {
        return map(filter(this.data, {type: 'subpillar', active: true}), indicator => indicator._id)
    }

    @computed get nested() {

        const indicators = map(filter(this.data, {type: 'index'}), index => {

            index.pillars = filter(filter(this.data, {type: 'pillar'}), {index: index._id})

            forEach(index.pillars, pillar => {
                pillar.subpillars = filter(filter(this.data, {type: 'subpillar'}), {pillar: pillar._id})
            })

            return index

        })

        return sortBy(indicators, 'sortOrder')

    }

    @action setRecords = records => {
        forEach(filter(this.data.slice(), 'active'), indicator => {
            if (find(records, {indicatorId: indicator._id})) {
                indicator.records = true
            } else {
                indicator.records = false
            }
        })
    }

    /*
     *  Indicator admin
     */

    @action setUpdateIndex = index => this.updateIndex = index
    @action setUpdatePillar = (pillar) => this.updatePillar = pillar
    @action setUpdateSubpillar = (subpillar, find) => this.updateSubpillar = subpillar

    @computed get dropdownIndexTypeOptions() {
        return ([
            {key: 'KI', text: 'Knowledge Index', value: 'KI'},
            {key: 'RI', text: 'Reading Index', value: 'RI'}
        ])
    }

    @computed get dropdownIndexOptions() {
        return map(filter(this.data.slice(), {type: 'index'}), index => ({key: index._id, text: index.nameEn, value: index._id}))
    }

    @computed get dropdownPillarOptions() {
        return map(filter(this.data.slice(), {type: 'pillar'}), pillar => ({key: pillar._id, text: pillar.nameEn, value: pillar._id}))
    }

    @computed get dropdownPillarOptionsForSubpillar() {
        const pillars = []
        forEach(this.nested, index => {
            if (index._id === this.updateSubpillar.index) {
                forEach(index.pillars, pillar => {
                    pillars.push({key: pillar._id, text: pillar.nameEn, value: pillar._id})
                })
            }
        })
        return pillars
    }

    @computed get dropdownSubpillarOptions() {
        return map(filter(this.data, {type: 'subpillar'}), subpillar => ({key: subpillar._id, text: subpillar.nameEn, value: subpillar._id}))
    }

    /*
     * Indicator drop down items
     */

    @action setSelectedIndexTypes = types => this.selectedIndexTypes.replace(types)
    @action setSelectedIndexIds = ids => this.selectedIndexIds.replace(ids)
    @action setSelectedPillarIds = ids => this.selectedPillarIds.replace(ids)
    @action setSelectedSubpillarIds = ids => this.selectedSubpillarIds.replace(ids)
    @action setIndexTypesToDisplay = () => this.indexTypesToDisplay.replace(this.selectedIndexTypes)
    @action setIndexIdsToDisplay = () => this.indexIdsToDisplay.replace(this.selectedIndexIds)

    @action setPillarIdsToDisplay = () => {
        this.indexIdsToDisplay.replace(this.selectedIndexIds)
        this.pillarIdsToDisplay.replace(this.selectedPillarIds)
    }

    @action setSubpillarIdsToDisplay = () => {
        this.indexIdsToDisplay.replace(this.selectedIndexIds)
        this.pillarIdsToDisplay.replace(this.selectedPillarIds)
        this.subpillarIdsToDisplay.replace(this.selectedSubpillarIds)
    }

}

class Index {

    @observable color
    @observable active
    @observable draw
    @observable records
    @observable open
    @observable colorIcon
    @observable whiteIcon

    constructor(index) {

        this._id = index._id
        this.nameEn = index.nameEn
        this.nameAr = index.nameAr || index.nameEn
        this.indexType = index.indexType
        this.sortOrder = index.sortOrder
        this.createdAt = index.createdAt
        this.changedAt = index.changedAt
        this.createdBy = index.createdBy
        this.changedBy = index.changedBy
        this.deleted = index.deleted
        this.color = index.color
        this.is2015 = index['2015'] || false
        this.type = 'index'
        this.icon = 'book'
        this.sortOrder = index.sortOrder
        this.active = false
        this.draw = false
        this.records = false
        this.open = false

        // TODO: get these from data
        this.colorIcon = 'https://s3-us-west-2.amazonaws.com/uncharted-flags/' + Meteor.settings.public.aws.indexIconsFolder + '/color/' + this._id + '.svg'
        this.whiteIcon = 'https://s3-us-west-2.amazonaws.com/uncharted-flags/' + Meteor.settings.public.aws.indexIconsFolder + '/white/' + this._id + '.svg'

    }

}

class Pillar {

    @observable color
    @observable active
    @observable draw
    @observable records
    @observable open

    constructor(pillar) {

        this._id = pillar._id

        this.index = pillar.index
        this.indexNameEn = pillar.indexNameEn
        this.colorIcon = pillar.colorIcon // From index
        this.whiteIcon = pillar.whiteIcon // From index
        this.indexType = pillar.indexType // From index

        this.nameEn = pillar.nameEn
        this.nameAr = pillar.nameAr || pillar.nameEn
        this.createdAt = pillar.createdAt
        this.changedAt = pillar.changedAt
        this.createdBy = pillar.createdBy
        this.changedBy = pillar.changedBy
        this.color = pillar.color
        this.is2015 = pillar['2015'] || false
        this.type = 'pillar'
        this.icon = 'file text outline'
        this.active = false
        this.draw = false
        this.records = false
        this.open = false

    }

}

class Subpillar {

    @observable color
    @observable active
    @observable draw
    @observable records
    @observable open

    constructor(subpillar) {

        this._id = subpillar._id

        this.index = subpillar.index
        this.indexNameEn = subpillar.indexNameEn
        this.colorIcon = subpillar.colorIcon // From index
        this.whiteIcon = subpillar.whiteIcon // From index
        this.indexType = subpillar.indexType // From index

        this.pillar = subpillar.pillar
        this.pillarNameEn = subpillar.pillarNameEn

        this.nameEn = subpillar.nameEn
        this.nameAr = subpillar.nameAr || subpillar.nameEn
        this.createdAt = subpillar.createdAt
        this.changedAt = subpillar.changedAt
        this.createdBy = subpillar.createdBy
        this.changedBy = subpillar.changedBy
        this.color = subpillar.color
        this.is2015 = subpillar['2015'] || false
        this.type = 'subpillar'
        this.icon = 'unordered list'
        this.active = false
        this.draw = false
        this.records = false
        this.open = false

    }

}

export default new Indicators()