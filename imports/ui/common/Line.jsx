/*-------------------------------------------------------------------------*
 * Object name:   Line.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Render a line for an SVG
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #15.1  06/14/2017  Pablo Rocha  - Fix prop type declarations
 *-------------------------------------------------------------------------*/

// Libs
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Line extends Component {

    static propTypes = {
        classed: PropTypes.string,
        strokeLineCap: PropTypes.string,
        fill: PropTypes.string,
        stroke: PropTypes.string,
        strokeWidth: PropTypes.string,
        d: PropTypes.any
    }

    static defaultProps = {
        classed: 'line',
        strokeLineCap: 'round',
        fill: 'none',
        stroke: '#000000',
        strokeWidth: '2px'
    }

    constructor(props) {
        super(props)
        // This is done using CSS keyframes instead
        // this.state = {offset: '500%'};
        // Meteor.setTimeout(() => this.setState({offset: '0%'}), 50);
    }

    render() {

        const {classed, d, strokeLineCap, stroke, fill, strokeWidth} = {...this.props}

        // These are path attributes for when we do not use CSS keyframes
        // strokeDashoffset={this.state.offset}
        // strokeDasharray="500%"

        return (

            <path
                stroke={stroke}
                fill={fill}
                strokeWidth={strokeWidth}
                className={classed}
                d={d}
                strokeLinecap={strokeLineCap}
            />

        )

    }
}