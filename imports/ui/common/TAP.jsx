import React from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

@inject('ui') @observer
export default class TAP extends React.Component {

    static propTypes = {
        translate: PropTypes.string,
        text: PropTypes.string,
        number: PropTypes.number
    }

    static defaultProps = {}

    render() {

        const {number, text, translate, ui} = this.props

        let string

        if (translate) {
            string = ui.translate(translate, ui.language)
        } else if (text) {
            string = text
        } else if (number) {
            string = ui.language === 'en' ? number.toLocaleString('en-US') : number.toLocaleString('ar-EG')
        }

        // We want a different style for Arabic text
        const style = ui.language === 'ar' || translate === 'language' ?
            {
                fontFamily: '"Droid Arabic Kufi", "Roboto", "Droid Sans", "Helvetica Neue", Arial, Helvetica, sans-serif'
            } : {}

        return (
            <span style={style}>{string}</span>
        )

    }

}