// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {Header} from 'semantic-ui-react'
import {upperCase} from 'lodash'

// Components

// BigCountryName - large country name with a fixed position
export default class BigCountryName extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        language: PropTypes.string
    }

    static defaultProps = {
        language: 'en'
    }

    styleEn = {
        position: 'absolute',
        textAlign: 'right',
        right: 0,
        bottom: -38,
        fontSize: 78,
        color: 'white'
    }

    styleAr = {
        position: 'absolute',
        textAlign: 'left',
        left: 0,
        bottom: -19,
        fontSize: 78,
        color: 'white'
    }

    render() {

        const {language, name} = this.props

        const style = language === 'ar' ? this.styleAr : this.styleEn

        return (
            <Header size='huge' style={style}>{upperCase(name)}</Header>
        )

    }

}