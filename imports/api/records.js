/*-------------------------------------------------------------------------*
 * Object name:   records.js
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Records server methods and API calls
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master         07/09/2017  Pablo Rocha  - Add latestRecord publication, needed or records.new does not pull the latest record
 *                                         - Change substring on records.new to 1 from 0
 * master  #24.1  07/13/2017  Pablo Rocha  - Do not pull back "bad" records with no "value"
 * master  #28.1  07/13/2017  Pablo Rocha  - Add singleRecord publication
 *                                         - Return error on records.new if record already exists
 *-------------------------------------------------------------------------*/

// Libs
import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {check} from 'meteor/check'
import {omit, parseInt} from 'lodash'

export const Records = new Mongo.Collection('records')

if (Meteor.isServer) {

    Records.deny({
        insert() {
            return true;
        },
        update() {
            return true;
        },
        remove() {
            return true;
        },
    })

    Meteor.publish('latestRecord', () => {
        return Records.find({}, {sort: {_id: -1}, limit: 1})
    })

    Meteor.publish('singleRecord', (country, index, pillar, subpillar, year) => {

        if (subpillar) {

            return Records.find({
                country: country,
                index: index,
                pillar: pillar,
                subpillar: subpillar,
                year: year,
            }, {limit: 1})

        } else if (pillar) {

            return Records.find({
                country: country,
                index: index,
                pillar: pillar,
                $or: [{subpillar: null}, {subpillar: {$exists: false}}],
                year: year
            }, {limit: 1})

        } else {

            return Records.find({
                country: country,
                index: index,
                $or: [{pillar: null}, {pillar: {$exists: false}}],
                $or: [{subpillar: null}, {subpillar: {$exists: false}}],
                year: year
            }, {limit: 1})

        }

    })

    Meteor.publish('recordsForAdmin', (showDeleted, countries, indexes, pillars, subpillars) => {
        return Records.find({
            $or: [
                {country: {$in: countries}},
                {index: {$in: indexes}},
                {pillar: {$in: pillars}},
                {subpillar: {$in: subpillars}}
            ],
            delete: {$in: [null, false, showDeleted]}
        }, {sort: {year: 1}})
    })

    Meteor.publish('recordsForChart', (showDeleted, countries, indexes, pillars, subpillars, year) => {
        return Records.find({
            country: {$in: countries},
            $or: [
                {
                    index: {$in: indexes},
                    pillar: null,
                    subpillar: null
                },
                {
                    pillar: {$in: pillars},
                    subpillar: null
                },
                {
                    subpillar: {$in: subpillars},
                }
            ],
            value: {$exists: true, $ne: null},
            year: year,
            delete: {$in: [null, false, showDeleted]}
        }, {sort: {year: 1}})
    })

    Meteor.publish('recordsForProfile', (country, indexes, pillars, subpillars, year) => {
        return Records.find({
            country: country,
            $or: [
                {
                    index: {$in: indexes},
                    pillar: null,
                    subpillar: null
                },
                {
                    pillar: {$in: pillars},
                    subpillar: null
                },
                {
                    subpillar: {$in: subpillars},
                }
            ],
            year: year,
            delete: {$in: [null, false]}
        }, {sort: {year: 1}})
    })

}

Meteor.methods({

    'records.new'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (records.new)')
        }

        check(data, {
            country: String,
            index: String,
            pillar: Match.Optional(String),
            subpillar: Match.Optional(String),
            year: Number,
            value: Number
        })

        let existingRecord
        if (data.subpillar) {

            existingRecord = Records.findOne({
                country: data.country,
                index: data.index,
                pillar: data.pillar,
                subpillar: data.subpillar,
                year: data.year,
            })

        } else if (data.pillar) {

            existingRecord = Records.findOne({
                country: data.country,
                index: data.index,
                pillar: data.pillar,
                $or: [{subpillar: null}, {subpillar: {$exists: false}}],
                year: data.year
            })

        } else {

            existingRecord = Records.findOne({
                country: data.country,
                index: data.index,
                $or: [{pillar: null}, {pillar: {$exists: false}}],
                $or: [{subpillar: null}, {subpillar: {$exists: false}}],
                year: data.year
            })

        }

        if (existingRecord) {
            console.log(existingRecord)
            throw new Meteor.Error(403, 'Record already exists with value ' + existingRecord.value)
        }

        if (!data.pillar) data = omit(data, 'pillar')
        if (!data.subpillar) data = omit(data, 'subpillar')

        const count = parseInt(Records.findOne({}, {sort: {_id: -1}})._id.substring(1)) + 1
        const id = 'R' + ('0000000' + count).slice(-8) // pad with at least 7 zeroes

        data._id = id
        data.createdBy = Meteor.user().username
        data.createdAt = new Date()

        Records.insert(data)

    },

    'records.update'(_id, data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (records.update)')
        }

        if (!data.pillar) data = omit(data, 'pillar') // remove or check returns an exception
        if (!data.subpillar) data = omit(data, 'subpillar') // remove or check returns an exception

        check(_id, String)
        check(data, {
            country: String,
            index: String,
            pillar: Match.Maybe(String),
            subpillar: Match.Maybe(String),
            year: Number,
            value: Number
        })

        data.changedBy = Meteor.user().username
        data.changedAt = new Date()

        Records.update(_id, {
            $set: {...data}
        })

    }

})