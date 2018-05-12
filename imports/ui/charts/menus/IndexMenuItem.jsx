/*-------------------------------------------------------------------------*
 * Object name:   IndexMenuItem.jsx
 * Created by:    Pablo Rocha
 * Creation date: 06/13/2017
 * Description:   Menu.Item component with a chevron indicating sidebar
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #29.1  06/13/2017  Pablo Rocha  - Original release
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {Icon, Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

@inject('ui') @observer
export default class IndexMenuItem extends React.Component {

    state = {
        hover: false
    }

    static propTypes = {
        content: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired
    }

    static defaultProps = {}

    _handleItemClick = (e, {name}) => {
        const {ui} = this.props
        ui.indexMenuItemClicked(name)
    }

    _onMouseOver = () => this.setState({hover: true})
    _onMouseOut = () => this.setState({hover: false})

    render() {

        const {content, name, ui} = this.props
        const {hover} = this.state

        const active = ui.activeIndexMenuItem === name
        const flipped = ui.language === 'en' ? null : 'horizontally'
        const style = {float: ui.language === 'en' ? 'right' : 'left'}

        const chevronLeft = <Icon color='teal' flipped={flipped} name='chevron left' style={style}/>
        const chevronRight = <Icon flipped={flipped} name='chevron right' style={style}/>

        return (
            <Menu.Item
                active={active}
                content={<div>{content}{active ? chevronLeft : hover ? chevronRight : null}</div>}
                name={name}
                onClick={this._handleItemClick}
                onMouseOut={this._onMouseOut}
                onMouseOver={this._onMouseOver}
            />
        )

    }

}