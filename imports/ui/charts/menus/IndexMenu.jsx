/*-------------------------------------------------------------------------*
 * Object name:   IndexMenu.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Component to render leftmost vertical chart menu
 *-------------------------------------------------------------------------*
 * Modification history:
 * master  #17.1  06/12/2017  Pablo Rocha  - Add icon variable to each menu item
 * master  #14.1  06/13/2017  Pablo Rocha  - Hide when ui.presentationMode is true
 * master  #25.1  06/13/2017  Pablo Rocha  - Remove menu item to trigger ui.activeIndexMenuItem and
 *                                           the corresponding sidebar, we are leaving the sidebar
 *                                           component in ChartLayout for now because we want to bring
 *                                           it back at some point
 * master  #29.1  06/13/2017  Pablo Rocha  - Refactor to use IndexMenuItem
 *                                         - Convert to a functional component
 * master  #33.1  07/01/2017  Pablo Rocha  - Add item for KI/RI selection
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

// Components
import IndexMenuItem from './IndexMenuItem'
import SimpleYearDropdown from '../../common/SimpleYearDropdown'
import SimpleIndexTypeDropdown from '../../common/SimpleIndexTypeDropdown'
import StepPopup from '../../common/StepPopup'
import TAP from '../../common/TAP'

const IndexMenu = inject('ui')(observer(({ui}) => (

    <Menu
        className={ui.presentationMode ? 'presentation-mode' : ''}
        fixed='left'
        id='index-menu'
        vertical
    >

        <Menu.Item header><TAP translate='knowledge_index'></TAP></Menu.Item>

        <Menu.Item>
            <SimpleYearDropdown/>
        </Menu.Item>

        <Menu.Item>
            <SimpleIndexTypeDropdown/>
        </Menu.Item>

        <IndexMenuItem content={<StepPopup step={1}/>} name='countries'/>
        <IndexMenuItem content={<StepPopup step={2}/>} name='indicators'/>
        <IndexMenuItem content={<TAP translate='exportShare'/>} name='exportShare'/>

    </Menu>

)))

export default IndexMenu