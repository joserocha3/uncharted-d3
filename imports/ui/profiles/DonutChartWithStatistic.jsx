/*-------------------------------------------------------------------------*
 * Object name:   DonutChartWithStatistic.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Render a donut chart with some information
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #22.1  07/14/2017  Pablo Rocha  - Replace profileIcon with colorIcon
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Header, Image} from 'semantic-ui-react'

// Components
import DonutChart from '../charts/DonutChart'

export default class DonutChartWithStatistic extends React.Component {

    static propTypes = {
        header: PropTypes.string,
        colorIcon: PropTypes.string,
        percent: PropTypes.number,
        color: PropTypes.string,
        padding: PropTypes.bool
    }

    static defaultProps = {
        padding: true
    }

    render() {

        const {color, header, padding, percent, colorIcon} = this.props

        return (
            <Grid centered stackable>

                <Grid.Column width={7}>
                    <Header size='large' color='grey' icon>
                        <div><Image size='mini' src={colorIcon} alt={header}/></div>
                        {header.toUpperCase()}
                    </Header>
                </Grid.Column>

                <Grid.Column width={7} textAlign='right'>
                    <DonutChart percent={percent} color={color}/>
                </Grid.Column>

                {padding ? <Grid.Column width={16}/> : null}
                {padding ? <Grid.Column width={16}/> : null}

            </Grid>
        )

    }

}