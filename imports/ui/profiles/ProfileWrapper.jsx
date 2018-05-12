/*-------------------------------------------------------------------------*
 * Object name:   ProfileWrapper.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component to determine what profile to display
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #7     07/09/2017  Pablo Rocha  - Call indicators.setShow2015 instead of indicators.setGet2015
 * master  #16    07/09/2017  Pablo Rocha  - Add ui.groupToggle functionality
 * master  #22.1  07/14/2017  Pablo Rocha  - Replace profileIcon with colorIcon
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import {Container, Divider, Grid, Header, Image, List} from 'semantic-ui-react'
import {find, map} from 'lodash'

// Components
import BigStatistic from './BigStatistic'
import SmallStatistic from './SmallStatistic'
import BigCountryName from './BigCountryName'
import ProfileBreadcrumbs from '../profiles/ProfileBreadCrumbs'
import BarChart from '../charts/BarChart'
import DonutChartWithStatistic from './DonutChartWithStatistic'
import TAP from '../common/TAP'
import i18n from '../../startup/client/i18n'

@inject('countries', 'indicators', 'records', 'ui') @observer
export default class ProfileWrapper extends React.Component {

    twoColumns = {
        columnCount: 2,
        columnGap: 40
    }

    preLine = {
        whiteSpace: 'pre-line'
    }

    greyBackground = {
        backgroundColor: '#f2f2f2'
    }

    lightGreyBackground = {
        backgroundColor: '#f8f9fb'
    }

    _onResize = () => {
        const {ui} = this.props
        if (this.wrapper) ui.setChartDimensions(this.wrapper.clientWidth, 500)
    }

    componentWillMount() {
        window.addEventListener('resize', this._onResize)
    }

    componentDidMount() {
        this._onResize()

        const {indicators, records, ui} = this.props

        records.setProfileIndexes([])
        records.setProfilePillars([])
        records.setProfileSubpillars([])

        indicators.setShow2015(records.profileYear === 2015)

        ui.setGroupToggle('indicator')

    }

    componentDidUpdate() {
        this._onResize()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._onResize)
    }

    render() {

        const {records, ui} = this.props

        const country = records.profileCountry
        if (!records.profileCountry._id) return <div/>

        const profile = find(country.profiles, {year: records.profileYear})
        if (!profile) return <div>No profile data found for year {records.profileYear}</div>

        const countryMapColumn = (
            <Grid.Column width={6} only='computer' style={{direction: 'ltr', zIndex: -1}}>
                <Image width='250%' ui={false} src={country.profileMap}/>
            </Grid.Column>
        )

        const name = ui.language === 'en' ? country.nameEn : country.nameAr
        const overview = ui.language === 'en' ? profile.overview : profile.ar_overview
        const years = ui.language === 'en' ? i18n.en.translation.years : i18n.ar.translation.years

        const indicators = records.recordsWithCountryAndIndicatorData
        const donuts = map(indicators, (record, index) =>
            <Grid.Column key={record._id + record.countryId + record.index + record.pillar + record.subpillar + record.year}>
                <DonutChartWithStatistic
                    header={record.indicatorName}
                    colorIcon={record.colorIcon}
                    percent={record.value / 100}
                    color={record.indicatorColor}
                    padding={index !== indicators.length - 1}
                />
            </Grid.Column>
        )

        return (
            <Container id='profile-wrapper'>

                <div ref={ref => this.wrapper = ref}>

                    <Image width='100%' src={country.profileHeader}/>

                    <Grid padded stackable verticalAlign='middle'>

                        {ui.language === 'en' ? countryMapColumn : null}

                        <Grid.Column computer={10} tablet={16}>

                            <Grid stackable>

                                <Grid.Row columns={2}>
                                    <Grid.Column><BigStatistic icon='area-icon.png' translate='area' value={profile.area} suffix='sq_km'/></Grid.Column>
                                    <Grid.Column><BigStatistic icon='population-icon.png' translate='total_population' value={profile.totalPopulation}/></Grid.Column>
                                </Grid.Row>

                                <Grid.Row columns={1}>
                                    <Grid.Column><Divider/></Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column computer={3} tablet={2}><Image height='80px' src={country.flag}/></Grid.Column>
                                    <Grid.Column computer={7} tablet={6}>
                                        <List size='tiny' relaxed>
                                            <List.Item><SmallStatistic translate='population_growth_rate' value={profile.populationGrowthRate} suffix={'%'}/></List.Item>
                                            <List.Item><SmallStatistic translate='gdp_per_capita' value={profile.gdpPerCapita} suffix={' USD'}/></List.Item>
                                            <List.Item><SmallStatistic translate='youth_literacy_rate' value={profile.youthLiteracyRate} suffix={'%'}/></List.Item>
                                            <List.Item><SmallStatistic translate='percentage_of_youth' value={profile.percentageOfYouth} suffix={'%'}/></List.Item>
                                        </List>
                                    </Grid.Column>
                                    <Grid.Column computer={6} tablet={5}>
                                        <List size='tiny' relaxed>
                                            <List.Item><SmallStatistic translate='gdp_growth_rate' value={profile.gdpGrowthRate} suffix={'%'}/></List.Item>
                                            <List.Item><SmallStatistic translate='youth_unemployment_rate' value={profile.youthUnemploymentRate} suffix={'%'}/></List.Item>
                                            <List.Item><SmallStatistic translate='gdp' value={profile.gdp} suffix={' USD'}/></List.Item>
                                            <List.Item><SmallStatistic translate='life_expectancy_at_birth' value={profile.lifeExpectancyAtBirth} suffix={' ' + years}/></List.Item>
                                        </List>
                                    </Grid.Column>
                                </Grid.Row>

                            </Grid>

                        </Grid.Column>

                        {ui.language === 'ar' ? countryMapColumn : null}

                    </Grid>

                    <Grid padded columns={1}>
                        <Grid.Column style={this.greyBackground}>
                            <BigCountryName name={name} language={ui.language}/>
                            <Grid padded centered>
                                <Grid.Row/>
                                <Grid.Row/>
                                <Grid.Column only='computer' width={15}>
                                    <div style={{...this.twoColumns, ...this.preLine}}>{overview}</div>
                                </Grid.Column>
                                <Grid.Column style={this.preLine} only='tablet mobile' width={16}>
                                    <div>{overview}</div>
                                </Grid.Column>
                                <Grid.Row></Grid.Row>
                                <Grid.Row></Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid>

                    <Header className='massive' textAlign='center'>
                        <span style={{color: '#0fadc5'}}>{records.profileYear}</span>&nbsp;
                        <span style={{color: '#f2f2f2'}}><TAP translate='knowledge_index_indicators'/></span>
                    </Header>

                    <Grid columns={1} textAlign='center'>
                        <Grid.Column>
                            <ProfileBreadcrumbs/>
                        </Grid.Column>
                    </Grid>

                    <svg
                        id='svg-chart'
                        height={500}
                        width={ui.chartDimensions.width}
                    >
                        <BarChart profile={true}/>
                    </svg>

                    <Grid columns={2} style={{...this.lightGreyBackground, minHeight: 200}} stackable>
                        <Grid.Row/>
                        {donuts}
                        <Grid.Row/>
                    </Grid>

                </div>

            </Container>
        )

    }

}