function Extension(type) {
    switch (type) {
        case 'image/png':
            return '.png'
        case 'image/jpeg':
            return '.jpeg'
        case 'image/svg+xml':
            return '.svg'
        default:
            return ''
    }
}

/*
*
*  uploadFlag
*
*/

Slingshot.createDirective('uploadFlag', Slingshot.S3Storage, {
    bucket: 'uncharted-flags',
    region: 'us-west-2',
    AWSAccessKeyId: Meteor.settings.private.aws.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.aws.AWSSecretAccessKey,
    cdn: Meteor.settings.private.aws.cdn,
    acl: 'public-read',
    authorize: function () {
        if (!this.userId) {
            var message = 'Please login before posting files'
            throw new Meteor.Error('Login Required', message)
        }
        return true
    },
    key: function (file, metaData) {
        return (Meteor.settings.private.aws.flagsFolder || 'flags') + '/' + metaData.fileName + Extension(file.type)
    },
    maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited)
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
})

Slingshot.fileRestrictions('uploadFlag', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
})

/*
 *
 *  uploadProfileHeader
 *
 */

Slingshot.createDirective('uploadProfileHeader', Slingshot.S3Storage, {
    bucket: 'uncharted-flags',
    region: 'us-west-2',
    AWSAccessKeyId: Meteor.settings.private.aws.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.aws.AWSSecretAccessKey,
    cdn: Meteor.settings.private.aws.cdn,
    acl: 'public-read',
    authorize: function () {
        if (!this.userId) {
            var message = 'Please login before posting files'
            throw new Meteor.Error('Login Required', message)
        }
        return true
    },
    key: function (file, metaData) {
        return (Meteor.settings.private.aws.profileHeadersFolder || 'profile-headers') + '/' + metaData.fileName + Extension(file.type)
    },
    maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited)
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
})

Slingshot.fileRestrictions('uploadProfileHeader', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
})

/*
 *
 *  uploadProfileMap
 *
 */

Slingshot.createDirective('uploadProfileMap', Slingshot.S3Storage, {
    bucket: 'uncharted-flags',
    region: 'us-west-2',
    AWSAccessKeyId: Meteor.settings.private.aws.AWSAccessKeyId,
    AWSSecretAccessKey: Meteor.settings.private.aws.AWSSecretAccessKey,
    cdn: Meteor.settings.private.aws.cdn,
    acl: 'public-read',
    authorize: function () {
        if (!this.userId) {
            var message = 'Please login before posting files'
            throw new Meteor.Error('Login Required', message)
        }
        return true
    },
    key: function (file, metaData) {
        return (Meteor.settings.private.aws.profileMapsFolder || 'profile-maps') + '/' + metaData.fileName + Extension(file.type)
    },
    maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited)
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
})

Slingshot.fileRestrictions('uploadProfileMap', {
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited)
})