import {Meteor} from 'meteor/meteor'
import {Accounts} from 'meteor/accounts-base'
import {check} from 'meteor/check'

if (Meteor.isServer) {

    Meteor.publish('allUsers', function () {
        return Meteor.users.find({}, {
            fields: {
                _id: 1,
                username: 1,
                emails: 1,
                profile: 1,
                createdAt: 1,
                createdBy: 1,
                changedAt: 1,
                changedBy: 1,
                status: 1
            }
        })
    })

    Accounts.onCreateUser((options, user) => {
        user._id = user.username
        user.profile = options.profile || {}
        user.createdBy = Meteor.user().username
        return user
    })

    Accounts.validateLoginAttempt(function (info) {

        const {allowed, user, error} = info
        const loginFailedAttempts = user && user.profile ? user.profile.loginFailedAttempts || 0 : 0

        if (!user) throw new Meteor.Error(403, 'Incorrect username or password.')
        if (loginFailedAttempts >= 5) throw new Meteor.Error(403, 'Too many failed attempts. Your account has been locked. Please contact an administrator to unlock.')

        if (error && error.error == 403) {

            // increment the fail attempts
            Meteor.users.update({_id: user._id}, {$set: {'profile.loginFailedAttempts': loginFailedAttempts + 1}})
            throw new Meteor.Error(403, 'Incorrect username or password.')

        } else if (allowed) {

            // success login set to 0
            Meteor.users.update({_id: user._id}, {$set: {'profile.loginFailedAttempts': 0}})

        }

        return allowed // false if username not found, incorrect username/password combination, or some other non-403 error

    })

    Accounts.emailTemplates.siteName = ''
    Accounts.emailTemplates.from = 'Password Reset <contact@nomoreanalog.com>'
    Accounts.emailTemplates.resetPassword.subject = (user) => 'Reset Password Link for ' + user.username
    Accounts.emailTemplates.resetPassword.html = (user, url) => {

        const token = url.substring(url.lastIndexOf('/') + 1, url.length)
        const newUrl = Meteor.absoluteUrl('resetPassword/' + token)

        return (
            `<!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        <title>Reset Password Link</title>
                        <style type="text/css">
                            @media only screen and (max-width: 620px) {
                            table[class=body] h1 {
                            font-size: 28px !important;
                            margin-bottom: 10px !important; }
                            table[class=body] p,
                            table[class=body] ul,
                            table[class=body] ol,
                            table[class=body] td,
                            table[class=body] span,
                            table[class=body] a {
                            font-size: 16px !important; }
                            table[class=body] .wrapper,
                            table[class=body] .article {
                            padding: 10px !important; }
                            table[class=body] .content {
                            padding: 0 !important; }
                            table[class=body] .container {
                            padding: 0 !important;
                            width: 100% !important; }
                            table[class=body] .main {
                            border-left-width: 0 !important;
                            border-radius: 0 !important;
                            border-right-width: 0 !important; }
                            table[class=body] .btn table {
                            width: 100% !important; }
                            table[class=body] .btn a {
                            width: 100% !important; }
                            table[class=body] .img-responsive {
                            height: auto !important;
                            max-width: 100% !important;
                            width: auto !important; }}
                            @media all {
                            .ExternalClass {
                            width: 100%; }
                            .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                            line-height: 100%; }
                            .apple-link a {
                            color: inherit !important;
                            font-family: inherit !important;
                            font-size: inherit !important;
                            font-weight: inherit !important;
                            line-height: inherit !important;
                            text-decoration: none !important; }
                            .btn-primary table td:hover {
                            background-color: #34495e !important; }
                            .btn-primary a:hover {
                            background-color: #34495e !important;
                            border-color: #34495e !important; } }
                        </style>
            </head>
            <body class="" style="background-color:#f6f6f6;font-family:sans-serif;-webkit-font-smoothing:antialiased;font-size:14px;line-height:1.4;margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;">
            <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#f6f6f6;width:100%;">
                <tr>
                    <td style="font-family:sans-serif;font-size:14px;vertical-align:top;">&nbsp;</td>
                    <td class="container" style="font-family:sans-serif;font-size:14px;vertical-align:top;display:block;max-width:580px;padding:10px;width:580px;Margin:0 auto !important;">
                        <div class="content" style="box-sizing:border-box;display:block;Margin:0 auto;max-width:580px;padding:10px;">
                            <!-- START CENTERED WHITE CONTAINER -->
                            <span class="preheader" style="color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;visibility:hidden;width:0;">Hi there, ${user.username}! Looks like you forgot your password.</span>
                            <table class="main" style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;background:#fff;border-radius:3px;width:100%;">
                                <!-- START MAIN CONTENT AREA -->
                                <tr>
                                    <td class="wrapper" style="font-family:sans-serif;font-size:14px;vertical-align:top;box-sizing:border-box;padding:20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;">
                                            <tr>
                                                <td style="font-family:sans-serif;font-size:14px;vertical-align:top;">
                                                    <p style="font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px;">Hi there, ${user.username}!</p>
                                                    <p style="font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px;">Looks like you forgot your password. Simply click the button below to reset it.</p>
                                                    <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;box-sizing:border-box;width:100%;">
                                                        <tbody>
                                                        <tr>
                                                            <td align="left" style="font-family:sans-serif;font-size:14px;vertical-align:top;padding-bottom:15px;">
                                                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;width:auto;">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="font-family:sans-serif;font-size:14px;vertical-align:top;background-color:#ffffff;border-radius:5px;text-align:center;background-color:#00adc6;"> <a href="${newUrl}" target="_blank" style="text-decoration:underline;background-color:#ffffff;border:solid 1px #00adc6;border-radius:5px;box-sizing:border-box;color:#00adc6;cursor:pointer;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:12px 25px;text-decoration:none;text-transform:capitalize;background-color:#00adc6;border-color:#00adc6;color:#ffffff;">Reset Password</a> </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    <p style="font-family:sans-serif;font-size:14px;font-weight:normal;margin:0;Margin-bottom:15px;">You can also copy and paste the following link into your browser:<br><br> ${newUrl}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- END MAIN CONTENT AREA -->
                            </table>
                            <!-- START FOOTER -->
                            <div class="footer" style="clear:both;padding-top:10px;text-align:center;width:100%;">
                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;mso-table-lspace:0pt;mso-table-rspace:0pt;width:100%;">
                                    <tr>
                                        <td class="content-block powered-by" style="font-family:sans-serif;font-size:14px;vertical-align:top;color:#999999;font-size:12px;text-align:center;">
                                            Powered by <a href="#" style="color:#3498db;text-decoration:underline;color:#999999;font-size:12px;text-align:center;text-decoration:none;">NoMoreAnalog</a>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <!-- END FOOTER -->
                            <!-- END CENTERED WHITE CONTAINER -->
                        </div>
                    </td>
                    <td style="font-family:sans-serif;font-size:14px;vertical-align:top;">&nbsp;</td>
                </tr>
            </table>
            </body>
            </html>`
        )
    }

}

Meteor.methods({

    'users.new'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (users.new)')
        }

        check(data, {
            username: String,
            firstName: String,
            lastName: String,
            email: String,
            password: String,
            company: String
        })

        const validateEmail = (email) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        }

        if (!validateEmail(data.email)) {
            throw new Meteor.Error(406, 'Email address is not valid')
        }

        Accounts.createUser({
            username: data.username,
            email: data.email,
            password: data.password,
            profile: {
                first_name: data.firstName,
                last_name: data.lastName,
                company: data.company,
            }
        })

    },

    'users.update'(data) {

        if (!this.userId) {
            throw new Meteor.Error(403, 'You do not have access to perform operation (users.update)')
        }

        check(data, {
            _id: String,
            firstName: String,
            lastName: String,
            company: String,
            email: String
        })

        const validateEmail = (email) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        }

        if (!validateEmail(data.email)) {
            throw new Meteor.Error(406, 'Email address is not valid')
        }

        Meteor.users.update({_id: data._id}, {
            $set: {
                'profile.first_name': data.firstName,
                'profile.last_name': data.lastName,
                'profile.company': data.company,
                'emails.0.address': data.email,
                changedBy: Meteor.user().username,
                changedAt: new Date()
            }
        })

    },

    'users.resetLoginFailedAttempts' (_id) {

        Meteor.users.update({_id: _id}, {
            $set: {
                'profile.loginFailedAttempts': 0,
                changedBy: Meteor.user().username,
                changedAt: new Date()
            }
        })

    },

    'users.logout' (_id) {

        Meteor.users.update({_id: _id}, {
            $set: {"services.resume.loginTokens": []}
        })

    },

    'users.forgotPassword' (username) {
        const user = Accounts.findUserByUsername(username)
        Accounts.sendResetPasswordEmail(user._id)
    }

})
