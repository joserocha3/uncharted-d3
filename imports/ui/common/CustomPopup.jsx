import {Popup} from 'semantic-ui-react'

export default class CustomPopup extends Popup {

    computePopupStyle(positions) {

        const style = {}
        const {pageXOffset} = window
        const xOffset = (this.coords.width - this.popupCoords.width) / 2
        const chartRect = document.getElementById('svg-chart').getBoundingClientRect()

        style.left = Math.round(this.coords.left + xOffset + pageXOffset)
        style.right = 'auto'

        if (chartRect) {
            style.top = (chartRect.top + 15) + 'px' // just a little padding
            style.position = 'fixed'
        } else {
            style.top = '140px'
            style.position = 'absolute'
        }

        return style

    }

}