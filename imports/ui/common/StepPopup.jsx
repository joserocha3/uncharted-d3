import React from 'react'
import {Popup} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {split} from 'lodash'

import i18n from '../../startup/client/i18n'
import TAP from './TAP'

@inject('countries', 'indicators', 'ui') @observer
export default class StepPopup extends React.Component {

    render() {

        const {countries, indicators, step, ui} = this.props

        let id, open, trigger, word

        switch (step) {
            case 1:
                id = 'step-1'
                open = countries.activeIds.length === 0
                trigger = <TAP translate='countries'/>
                word = ui.language === 'en' ? i18n.en.translation.select_countries : i18n.ar.translation.select_countries
                break;
            case 2:
                id = 'step-2'
                open = indicators.activeIds.length === 0
                trigger = <TAP translate='indicators'/>
                word = ui.language === 'en' ? i18n.en.translation.select_indicators : i18n.ar.translation.select_indicators
                break;
            case 3:
                id = 'step-3'
                open = ui.activeChartMenuItem === null
                trigger = <TAP translate='charts'/>
                word = ui.language === 'en' ? i18n.en.translation.select_chart : i18n.ar.translation.select_chart
                break;
        }

        const parts = split(word, ':', 2)

        return (
            <Popup
                id={id}
                content={
                    <div>
                        <span style={{fontWeight: 'bold', color: '#00adc6'}}>{parts[0]}:</span> {parts[1]}
                    </div>
                }
                open={open}
                position='right center'
                trigger={trigger}
            />
        )

    }

}