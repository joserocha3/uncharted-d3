// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'

// Components
import TAP from '../common/TAP'

// ProfileWrapper - determine what profile to display
@inject('countries', 'ui') @observer
export default class SmallStatistic extends React.Component {

    static propTypes = {
        translate: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        suffix: PropTypes.string
    }

    static defaultProps = {}

    render() {

        const {suffix, translate, value} = this.props

        return (
            <div id='big-statistic'>
                <TAP translate={translate}/>: <span style={{fontWeight: 'bold', color: '#0fadc5'}}><TAP number={value}/><TAP text={suffix}/></span>
            </div>
        )

    }

}