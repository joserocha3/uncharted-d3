import React, {Component} from 'react'
import PropTypes from 'prop-types'

// Dot component - Dot to display on chart or next to country/indicator name
export default class Dot extends Component {

    static propTypes = {
        cx: PropTypes.number,
        cy: PropTypes.number,
        classed: PropTypes.string,
        radius: PropTypes.number,
        fill: PropTypes.string,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.number,
        strokeOpacity: PropTypes.number,
        createSvg: PropTypes.bool,
        style: PropTypes.object
    };

    static defaultProps = {
        cx: 0,
        cy: 0,
        classed: 'dot',
        radius: 5,
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 0,
        strokeOpacity: 1,
        createSvg: false,
        style: {}
    };

    render() {

        const {cx, cy, classed, radius, fill, stroke, strokeWidth, strokeOpacity, createSvg, style} = this.props

        let cxOut, cyOut

        if (createSvg) {
            cxOut = radius + strokeWidth
            cyOut = radius + strokeWidth
        } else {
            cxOut = cx
            cyOut = cy
        }

        const circle =
            <circle
                className={classed}
                r={radius}
                cx={cxOut}
                cy={cyOut}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth + 'px'}
                strokeOpacity={strokeOpacity}
            />

        return createSvg ?
            <div style={style} className={classed}>
                <svg className='dot' width={(radius + strokeWidth) * 2} height={(radius + strokeWidth) * 2}>
                    {circle}
                </svg>
            </div> : circle

    }

}