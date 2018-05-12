import React from 'react'
import {inject, observer} from 'mobx-react'
import {Breadcrumb} from 'semantic-ui-react'
import {find} from 'lodash'

import TAP from '../common/TAP'

@inject('indicators', 'records', 'ui') @observer
export default class ProfileBreadcrumbs extends React.Component {

    _indexClick = () => {

        const {indicators, records} = this.props

        records.setProfileIndexes(indicators._getIndexIds())
        records.setProfilePillars([])
        records.setProfileSubpillars([])

        records.updateRecordsDataForProfile()

    }

    _pillarClick = () => {

        const {indicators, records} = this.props

        const indexId = find(indicators.data.slice(), {type: 'subpillar', _id: records.profileSubpillars[0]}).index

        records.setProfileIndexes([])
        records.setProfilePillars(indicators._getPillarIdsForIndexId(indexId))
        records.setProfileSubpillars([])

        records.updateRecordsDataForProfile()

    }

    render() {

        const {records, ui} = this.props

        const divider = (
            ui.language === 'en' ?
                <Breadcrumb.Divider icon='right angle'/> :
                <Breadcrumb.Divider icon='right angle' flipped='horizontally'/>
        )

        return (
            <Breadcrumb>

                {records.profilePillars.length > 0 || records.profileSubpillars.length > 0 ?
                    <Breadcrumb.Section active={records.profileIndexes.length > 0} onClick={() => this._indexClick()}><TAP translate='indexes'/></Breadcrumb.Section> :
                    <Breadcrumb.Section active={records.profileIndexes.length > 0}><TAP translate='indexes'/></Breadcrumb.Section>
                }


                {divider}

                {records.profileSubpillars.length > 0 ?
                    <Breadcrumb.Section active={records.profilePillars.length > 0} onClick={() => this._pillarClick()}><TAP translate='pillars'/></Breadcrumb.Section> :
                    <Breadcrumb.Section active={records.profilePillars.length > 0}><TAP translate='pillars'/></Breadcrumb.Section>
                }

                {divider}

                <Breadcrumb.Section active={records.profileSubpillars.length > 0}><TAP translate='subpillars'/></Breadcrumb.Section>

            </Breadcrumb>
        )

    }

}