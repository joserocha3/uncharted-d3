/*-------------------------------------------------------------------------*
 * Object name:   Item.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component item to make up list in each section of Legend.jsx
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #18.1  07/12/2017  Pablo Rocha  - Call ui.setDisabled on click
 *-------------------------------------------------------------------------*/


// Libs
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {List} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

// Components
import Dot from '../../common/Dot'
import TAP from '../../common/TAP'

@inject('ui') @observer
export default class Item extends Component {

    static propTypes = {
        item: PropTypes.object.isRequired,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        disabled: false
    }

    _onClick = () => {

        const {disable, item, itemStore, ui} = this.props

        if (disable) return

        itemStore.toggleDraw(item._id)
        ui.setDisabled()

    }

    render() {

        const {disabled, item, ui} = this.props

        return disabled ?
            (
                <List.Item
                    key={item._id}
                    disabled
                    content={
                        <div>
                            <Dot classed='legend-dot' createSvg={true} fill={'#cacaca'}/>
                            <span>{ui.language === 'en' ? <TAP text={item.nameEn}/> : <TAP text={item.nameAr}/>}</span>
                        </div>
                    }
                />
            ) : (
                // If not disabled, but also not drawn then we need to manually set the disabled color of #cacaca, because if
                // we disable this item then it can no longer be clicked to draw it again
                <List.Item
                    key={item._id}
                    onClick={this._onClick}
                    style={{cursor: 'pointer'}}
                    content={
                        <div>
                            <Dot classed='legend-dot' createSvg={true} fill={item.draw ? item.color : '#cacaca'}/>
                            <span style={{color: item.draw ? item.color : '#cacaca'}}>{ui.language === 'en' ? <TAP text={item.nameEn}/> : <TAP text={item.nameAr}/>}</span>
                        </div>
                    }
                />
            )

    }

}