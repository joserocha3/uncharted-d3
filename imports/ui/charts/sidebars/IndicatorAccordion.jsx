import React from 'react'
import {Accordion} from 'semantic-ui-react'
import {includes, without} from 'lodash'

export default class IndicatorAccordion extends Accordion {

    handleTitleClick = (e, index) => {

        // This method is defined in the parent class, we want to override it

        e.target.getAttribute('class') === 'dropdown icon' ?
            this._handleDropdownClick(e, index) :
            this._handleTitleClick(e, index)

    }

    _handleDropdownClick = (e, index) => {
        const {onTitleClick, exclusive} = this.props
        const {activeIndex} = this.state

        let newIndex
        if (exclusive) {
            newIndex = index === activeIndex ? -1 : index
        } else {
            // check to see if index is in array, and remove it, if not then add it
            newIndex = includes(activeIndex, index) ? without(activeIndex, index) : [...activeIndex, index]
        }
        this.trySetState({activeIndex: newIndex})
        // if (onTitleClick) onTitleClick(e, index)
    }

    _handleTitleClick = (e, index) => {
        const {onTitleClick} = this.props
        if (onTitleClick) onTitleClick(e, index)
    }

}