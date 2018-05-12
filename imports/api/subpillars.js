/*-------------------------------------------------------------------------*
 * Object name:   subpillars.js
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Server code for subpillar API calls
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Save subpillar colors
 *                                         - Adjust Meteor.Error call parameters
 *-------------------------------------------------------------------------*/

// Libs
import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {check} from 'meteor/check'
import {parseInt} from 'lodash'

export const Subpillars = new Mongo.Collection('subpillars')

if (Meteor.isServer) {

    Subpillars.deny({
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

    Meteor.publish('subpillars', show2015 => {

        if (show2015) {
            return Subpillars.find()
        } else {
            return Subpillars.find({2015: {$in: [null, false]}})
        }

    })

}

Meteor.methods({

    'subpillars.new'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (subpillars.new)')
        }

        check(data, {
            index: String,
            pillar: String,
            nameEn: String,
            nameAr: String,
            color: String
        })

        const count = parseInt(Subpillars.findOne({}, {sort: {_id: -1}})._id.substring(0)) + 1
        const id = 'S' + ('0000000' + count).slice(-8) // pad with at least 7 zeroes

        Subpillars.insert({
            _id: id,
            index: data.index,
            pillar: data.pillar,
            nameEn: data.nameEn,
            nameAr: data.nameAr,
            color: data.color,
            createdAt: new Date(),
            createdBy: Meteor.user().username
        })

    },

    'subpillars.update'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (subpillars.update)')
        }

        check(data, {
            _id: String,
            index: String,
            pillar: String,
            nameEn: String,
            nameAr: String,
            color: String
        })

        Subpillars.update(data._id, {
            $set: {
                index: data.index,
                pillar: data.pillar,
                nameEn: data.nameEn,
                nameAr: data.nameAr,
                color: data.color,
                changedAt: new Date(),
                changedBy: Meteor.user().username
            }
        })

    }

})