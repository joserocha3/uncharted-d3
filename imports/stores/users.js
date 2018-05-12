import {Meteor} from 'meteor/meteor'
import {action, computed, observable} from 'mobx'
import moment from 'moment'

class Users {

    @observable data = []
    @observable adminSelectedData = []
    @observable updateUser = {}
    @observable currentUser = null
    @observable resetPasswordToken = null

    constructor() {

        Tracker.autorun(() => {
            this.currentUser = Meteor.user() ? Meteor.user().username : null
        })

    }

    @action startSubscription = () => {
        this.handle = Meteor.subscribe('allUsers')
        Tracker.autorun(() => {
            this.setUsers(Meteor.users.find({}, {sort: {username: 1}}).fetch())
        })
    }

    @action stopSubscription = () => this.handle.stop()

    @action setUsers = users => {

        this.data.replace(users.map(user => {
            return new User(
                user,
                this.data.find(u => user._id === u._id && u.adminSelectedUsername),
                this.data.find(u => user._id === u._id && u.adminSelectedEmail)
            )
        }))

        this.setAdminSelectedData()

    }

    @action setAdminSelectedData = () => this.adminSelectedData = this.data.filter(user => user.adminSelectedUsername || user.adminSelectedEmail)

    @action setUserAdminSelectedUsernames = ids => {
        ids.forEach(id => {
            const user = this.data.find(user => user._id === id)
            if (user) user.adminSelectedUsername = true;
        })
    }

    @action setUserAdminSelectedEmails = ids => {
        ids.forEach(id => {
            const user = this.data.find(user => user._id === id)
            if (user) user.adminSelectedEmail = true;
        })
    }

    @action clearAdminVariables = () => {
        this.data.forEach(user => user.adminSelectedUsername = false)
        this.data.forEach(user => user.adminSelectedEmail = false)
        this.adminSelectedData.replace([])
        this.updateUser = {}
    }

    @action setUpdateUser = user => this.updateUser = user
    @action setResetPasswordToken = token => this.resetPasswordToken = token

    @computed get dropdownUsernameOptions() {
        return this.data.map(user => ({key: user._id, text: user.username, value: user._id})) || []
    }

    @computed get dropdownEmailOptions() {
        return this.data.map(user => ({key: user._id, text: user.email, value: user._id})) || []
    }

    @computed get adminSelectedUsernames() {
        return this.data.filter(user => user.adminSelectedUsername).map(user => user._id)
    }

    @computed get adminSelectedEmails() {
        return this.data.filter(user => user.adminSelectedEmail).map(user => user._id)
    }

}

class User {

    _id
    createdAt
    username

    @observable firstName
    @observable lastName
    @observable company
    @observable email
    @observable loggedIn
    @observable lastLogin
    @observable accountLocked
    @observable adminSelectedUsername
    @observable adminSelectedEmail

    constructor(user, adminSelectedUsername, adminSelectedEmail) {

        this._id = user._id
        this.createdAt = user.createdAt ? moment(user.createdAt).format('lll') : null
        this.createdBy = user.createdBy
        this.changedAt = user.changedAt ? moment(user.changedAt).format('lll') : null
        this.changedBy = user.changedBy
        this.username = user.username

        this.firstName = user.profile ? user.profile.first_name : null
        this.lastName = user.profile ? user.profile.last_name : null
        this.company = user.profile ? user.profile.company : null
        this.email = user.emails ? user.emails[0].address : null
        this.loggedIn = user.status ? user.status.online : false
        this.lastLogin = user.status && user.status.lastLogin ? moment(user.status.lastLogin.date).format('lll') : null
        this.accountLocked = user.profile ? user.profile.loginFailedAttempts >= 5 : false
        this.adminSelectedUsername = adminSelectedUsername
        this.adminSelectedEmail = adminSelectedEmail

    }

}

export default new Users()