// Libs
import React from 'react'
import {Grid, Header, Image} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

// Components
import NavigationMenu from '../common/NavigationMenu'
import Footer from '../common/Footer'
import TAP from '../common/TAP'

// ProfileLayout - everything profile route starts here, handles the page layout
@inject('ui') @observer
export default class InfographicLayout extends React.Component {

    render() {

        const {ui} = this.props

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

        const bigSponsorStyle = ui.language === 'en' ?
            {...style, bottom: 91, right: 30} :
            {...style, bottom: 126, left: 30}

        return (
            <div id='infographic-layout'>

                <NavigationMenu/>

                <Grid columns={1} padded textAlign='center'>

                </Grid>

                <div style={bigSponsorStyle}>
                    <TAP translate='infographics_capitalized'/>
                </div>

                <div style={footerStyle}>
                    <Footer/>
                </div>

            </div>
        )

    }

}