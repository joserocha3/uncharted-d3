import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {check} from 'meteor/check'
import {find} from 'lodash'

export const Countries = new Mongo.Collection('countries')

if (Meteor.isServer) {

    Countries.deny({
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

    Meteor.publish('countries', function countriesPublication() {
        return Countries.find()
    })

}

Meteor.methods({

    'countries.getNextId'() {

        const count = Countries.find().count() + 1 // get count of this new document
        const id = 'C' + ('0000000' + count).slice(-8) // pad with at least 7 zeroes

        return id

    },

    'countries.new'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'Error 403: Forbidden', 'You do not have access to perform operation (countries.new)')
        }

        check(data, {
            _id: String,
            nameEn: String,
            nameAr: String,
            iso: String,
            flag: String,
            color: String,
            profileHeader: String,
            profileMap: String
        })

        Countries.insert({
            _id: data._id,
            nameEn: data.nameEn,
            nameAr: data.nameAr,
            iso: data.iso,
            flag: data.flag,
            color: data.color,
            profileHeader: data.profileHeader,
            profileMap: data.profileMap,
            createdAt: new Date(),
            createdBy: Meteor.user().username
        })

    },

    'countries.update'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'Error 403: Forbidden', 'You do not have access to perform operation (countries.update)')
        }

        check(data, {
            _id: String,
            nameEn: String,
            nameAr: String,
            iso: String,
            flag: String,
            color: String,
            profileHeader: String,
            profileMap: String
        })

        Countries.update(data._id, {
            $set: {
                nameEn: data.nameEn,
                nameAr: data.nameAr,
                iso: data.iso,
                flag: data.flag,
                color: data.color,
                profileHeader: data.profileHeader,
                profileMap: data.profileMap,
                changedAt: new Date(),
                changedBy: Meteor.user().username
            }
        })

    },

    'countries.year.save'(_id, data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'Error 403: Forbidden', 'You do not have access to perform operation (countries.profile.new)')
        }

        check(_id, String)
        check(data, {
            year: Number,
            area: Number,
            totalPopulation: Number,
            populationGrowthRate: Number,
            gdp: Number,
            gdpPerCapita: Number,
            gdpGrowthRate: Number,
            percentageOfYouth: Number,
            youthLiteracyRate: Number,
            youthUnemploymentRate: Number,
            lifeExpectancyAtBirth: Number,
            overview: String,
            ar_overview: String,
        })

        const country = Countries.findOne({_id: _id})
        const profile = find(country.profiles, {'year': data.year})

        if (profile) {
            data.createdAt = profile.createdAt
            data.createdBy = profile.createdBy
            data.changedAt = new Date()
            data.changedBy = Meteor.user().username
            Countries.update(_id, {$pull: {profiles: {year: data.year}}})
            Countries.update(_id, {$push: {profiles: data}})
        } else {
            data.createdAt = new Date()
            data.createdBy = Meteor.user().username
            Countries.update(_id, {
                $push: {profiles: data}
            })
        }

    }

})