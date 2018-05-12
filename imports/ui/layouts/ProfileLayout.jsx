// Libs
import React from 'react'

// Components
import NavigationMenu from '../common/NavigationMenu'
import ProfileSelectionMenu from '../profiles/ProfileSelectionMenu'
import ProfileWrapper from '../profiles/ProfileWrapper'
import Footer from '../common/Footer'

// ProfileLayout - everything profile route starts here, handles the page layout
export default class ProfileLayout extends React.Component {

    render() {

        return (
            <div id='profile-layout'>

                <NavigationMenu/>

                <ProfileSelectionMenu/>
                <ProfileWrapper/>
                <Footer/>

            </div>
        )

    }

}