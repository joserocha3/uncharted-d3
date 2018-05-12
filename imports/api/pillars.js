/*-------------------------------------------------------------------------*
 * Object name:   pillars.js
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Server code for pillar API calls
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Save pillar colors
 *                                         - Adjust Meteor.Error call parameters
 *-------------------------------------------------------------------------*/

// Libs
import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {check} from 'meteor/check'
import {parseInt} from 'lodash'

export const Pillars = new Mongo.Collection('pillars')

if (Meteor.isServer) {

    Pillars.deny({
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

    Meteor.publish('pillars', show2015 => {

        if (show2015) {
            return Pillars.find()
        } else {
            return Pillars.find({2015: {$in: [null, false]}})
        }

    })

}

Meteor.methods({

    'pillars.new'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (pillars.new)')
        }

        check(data, {
            index: String,
            nameEn: String,
            nameAr: String,
            color: String
        })

        const count = parseInt(Pillars.findOne({}, {sort: {_id: -1}})._id.substring(0)) + 1
        const id = 'P' + ('0000000' + count).slice(-8) // pad with at least 7 zeroes

        Pillars.insert({
            _id: id,
            index: data.index,
            nameEn: data.nameEn,
            nameAr: data.nameAr,
            color: data.color,
            createdAt: new Date(),
            createdBy: Meteor.user().username
        })

    },

    'pillars.update'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (pillars.update)')
        }

        check(data, {
            _id: String,
            index: String,
            nameEn: String,
            nameAr: String,
            color: String
        })

        Pillars.update(data._id, {
            $set: {
                index: data.index,
                nameEn: data.nameEn,
                nameAr: data.nameAr,
                color: data.color,
                changedAt: new Date(),
                changedBy: Meteor.user().username
            }
        })

    }

})