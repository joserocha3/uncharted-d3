/*-------------------------------------------------------------------------*
 * Object name:   indexes.js
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Server code for index API calls
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Save index colors
 *                                         - Adjust Meteor.Error call parameters
 * master  #22.1  07/14/2017  Pablo Rocha  - Remove profileIcon TODO: replace with colorIcon and whiteIcon
 *-------------------------------------------------------------------------*/

// Libs
import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {check} from 'meteor/check'
import {parseInt} from 'lodash'

export const Indexes = new Mongo.Collection('indexes')

if (Meteor.isServer) {

    Indexes.deny({
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

    Meteor.publish('indexes', show2015 => {

        if (show2015) {
            return Indexes.find()
        } else {
            return Indexes.find({2015: {$in: [null, false]}})
        }

    })

}

Meteor.methods({

    'indexes.new'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (indexes.new)')
        }

        check(data, {
            nameEn: String,
            nameAr: String,
            sortOrder: Number,
            indexType: String,
            color: String
        })

        const indexes = Indexes

        const count = parseInt(indexes.findOne({}, {sort: {_id: -1}})._id.substring(1)) + 1
        const id = 'I' + ('0000000' + count).slice(-8) // pad with at least 7 zeroes

        Indexes.insert({
            _id: id,
            ...data,
            createdAt: new Date(),
            createdBy: Meteor.user().username
        })

    },

    'indexes.update'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (indexes.update)')
        }

        check(data, {
            _id: String,
            nameEn: String,
            nameAr: String,
            sortOrder: Number,
            indexType: String,
            color: String
        })

        Indexes.update(data._id, {
            $set: {
                nameEn: data.nameEn,
                nameAr: data.nameAr,
                sortOrder: data.sortOrder,
                indexType: data.indexType,
                color: data.color,
                changedAt: new Date(),
                changedBy: Meteor.user().username
            }
        })

    }

})