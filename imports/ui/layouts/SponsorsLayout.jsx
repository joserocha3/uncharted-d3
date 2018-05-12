// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Image} from 'semantic-ui-react'

// Components
import NavigationMenu from '../common/NavigationMenu'
import Footer from '../common/Footer'
import TAP from '../common/TAP'

// ProfileLayout - everything profile route starts here, handles the page layout
export default class SponsorsLayout extends React.Component {

    static propTypes = {
        language: PropTypes.string
    }

    static defaultProps = {
        language: 'en'
    }

    render() {

        const {language} = this.props

        const layoutStyle = {
            height: '100%',
            backgroundColor: '#fbfbfb',
            paddingTop: 30
        }

        const footerStyle = {
            position: 'fixed',
            bottom: 0,
            width: '100%'
        }

        const style = {
            fontSize: 150,
            fontWeight: 'bold',
            position: 'fixed',
            color: '#e9e9e9',
        }

        const bigSponsorStyle = language === 'en' ?
            {...style, bottom: 91, right: 30} :
            {...style, bottom: 126, left: 30}

        return (
            <div id='sponsors-layout' style={layoutStyle}>

                <NavigationMenu/>

                <Grid columns={5} padded doubling centered>
                    <Grid.Column verticalAlign='middle'><Image centered height={200} src='/../images/qindeel2.png' alt='sponsor'/></Grid.Column>
                    <Grid.Column verticalAlign='middle'><Image centered height={200} src='/../images/qindeel-educational.png' alt='sponsor'/></Grid.Column>
                    <Grid.Column verticalAlign='middle'><Image centered height={200} src='/../images/qindeel-bookshop.png' alt='sponsor'/></Grid.Column>
                    <Grid.Column verticalAlign='middle'><Image centered height={200} src='/../images/qindeel-distribution.png' alt='sponsor'/></Grid.Column>
                </Grid>

                <div style={bigSponsorStyle}>
                    <TAP translate='sponsors_capitalized'/>
                </div>

                <div style={footerStyle}>
                    <Footer/>
                </div>

            </div>
        )

    }

}