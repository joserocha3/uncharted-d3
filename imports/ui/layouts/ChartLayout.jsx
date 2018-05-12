/*-------------------------------------------------------------------------*
 * Object name:   ChartLayout.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component to render leftmost vertical chart menu
 *-------------------------------------------------------------------------*
 * Modification history:
 * master  #17.1  07/12/2017  Pablo Rocha  - Check parents in _handleClick
 * master  #14.1  06/13/2017  Pablo Rocha  - Set Sidebar.Pushable id based ui.presentationMode
 * master  #25.1  06/13/2017  Pablo Rocha  - Comment next to ActiveIndicatorsSidebar, we want
 *                                           to bring it back at some point
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Sidebar} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {isEmpty} from 'lodash'

// Components
import NavigationMenu from '../common/NavigationMenu'
import ChartMenu from '../charts/menus/ChartMenu'
import Legends from '../charts/legend/Legends'
import IndexMenu from '../charts/menus/IndexMenu'
import CountriesSidebar from '../charts/sidebars/CountriesSidebar'
import IndicatorsSidebar from '../charts/sidebars/IndicatorsSidebar'
import ActiveIndicatorsSidebar from '../charts/sidebars/ActiveIndicatorsSidebar'
import SavedSidebar from '../charts/sidebars/SavedSidebar'
import ExportShareSidebar from '../charts/sidebars/ExportShareSidebar'
import ChartWrapper from '../charts/ChartWrapper'
import Footer from '../common/Footer'

@inject('ui') @observer
export default class ChartLayout extends React.Component {

    _handleClick = e => {
        const {ui} = this.props
        if ($(e.target).parents('.sidebar').length === 0 &&
            $(e.target).parents('#index-menu').length === 0) ui.closeSidebars()
    }

    _hasSomeParentTheClass = (element, className) => {
        if (element.className.split(' ').indexOf(className)>=0) return true;
        return element.parentNode && this._hasSomeParentTheClass(element.parentNode, className);
    }

    _handleKeyPress = e => {
        const {ui} = this.props
        if (e.keyCode === 27) ui.closeSidebars()
    }

    componentWillUpdate(nextProps, nextState) {

        // When a sidebar becomes visible, setup some handlers so we can easily close it

        const {ui} = nextProps

        if (isEmpty(ui.visibleSidebar)) {
            // Remove the listeners
            document.removeEventListener('keydown', this._handleKeyPress)
            document.removeEventListener('click', this._handleClick)
        }
        else {
            // Add a listeners
            document.addEventListener('keydown', this._handleKeyPress)
            document.addEventListener('click', this._handleClick)
        }

    }

    componentWillUnmount() {
        const {ui} = this.props
        // Remove the listeners and close sidebars
        document.removeEventListener('keydown', this._handleKeyPress)
        document.removeEventListener('click', this._handleClick)
        ui.closeSidebars()
    }

    render() {

        const {ui} = this.props

        return (

            <div id='chart-layout'>

                <NavigationMenu/>
                <ChartMenu/>
                <IndexMenu/>
                <Legends/>

                <Sidebar.Pushable id='chart-pushable' className={ui.presentationMode ? 'presentation-mode' : 'chart-pushable-'}>

                    <CountriesSidebar visible={ui.visibleSidebar === 'countries'}/>
                    <IndicatorsSidebar visible={ui.visibleSidebar === 'indicators'}/>
                    <ActiveIndicatorsSidebar visible={ui.visibleSidebar === 'active' /* This will not happen for now, menu item to trigger is not rendered */ }/>
                    <SavedSidebar visible={ui.visibleSidebar === 'saved'}/>
                    <ExportShareSidebar visible={ui.visibleSidebar === 'exportShare'}/>

                    <Sidebar.Pusher id='chart-pusher'>
                        <ChartWrapper/>
                        <Footer/>
                    </Sidebar.Pusher>

                </Sidebar.Pushable>

            </div>
        )

    }

}