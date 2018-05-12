// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import {Grid, Header, Image} from 'semantic-ui-react'

// Components
import TAP from '../common/TAP'

// ProfileWrapper - determine what profile to display
@inject('countries', 'ui') @observer
export default class BigStatistic extends React.Component {

    static propTypes = {
        icon: PropTypes.string.isRequired,
        translate: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        suffix: PropTypes.string
    }

    static defaultProps = {}

    render() {

        const {icon, suffix, translate, value} = this.props

        return (
            <div id='big-statistic'>

                <Grid>

                    <Grid.Column width={3}>
                        <Image src={'/../images/' + icon}/>
                    </Grid.Column>

                    <Grid.Column width={13}>
                        <Header size='huge' color='grey'>
                            <Header.Subheader>
                                <TAP translate={translate}/>:
                            </Header.Subheader>
                            <TAP number={value}/> <TAP translate={suffix}/>
                        </Header>
                    </Grid.Column>

                </Grid>

            </div>
        )

    }

}