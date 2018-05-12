/*-------------------------------------------------------------------------*
 * Object name:   Axis.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Component used for X and Y axises
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #9     07/09/2017  Pablo Rocha  - Make labels bold
 * master  #15.1  06/14/2017  Pablo Rocha  - Rewrite so we render X axis based on chart type
 * master  #15.2  06/14/2017  Pablo Rocha  - Correct line chart X axis
 * master  #15.5  06/16/2017  Pablo Rocha  - Remove chart prop and use scaleType instead, we now only use
 *                                           an axis that strictly adheres to the scale or a 'group' axis
 * master  #15.6  06/16/2017  Pablo Rocha  - Correct modification history
 * master  #10.1  07/01/2017  Pablo Rocha  - Set font size based on width breakpoints
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {axisLeft, select, axisBottom, selectAll} from 'd3'

export default class Axis extends React.Component {

    static propTypes = {
        height: PropTypes.number.isRequired,
        width: PropTypes.number,
        margin: PropTypes.object,
        scale: PropTypes.func.isRequired,
        scaleType: PropTypes.string,
        axisType: PropTypes.oneOf(['x', 'y']).isRequired,
        label: PropTypes.string,
        tickValues: PropTypes.array
    }

    static defaultProps = {
        width: 0,
        margin: {top: 0, bottom: 0, left: 0, right: 0},
        tickValues: []
    }

    componentDidMount() {
        this._renderAxis()
    }

    componentDidUpdate() {
        this._renderAxis()
    }

    _renderAxis() {

        const {axisType, scale, scaleType, tickValues, width} = this.props

        if (axisType === 'y') {
            select(this.axis).call(axisLeft(scale))
            return
        }

        switch (scaleType) {

            case 'group':

                // Copy the scale and change the domain values to be the names of
                // the countries/indicators

                const groupScale = scale.copy() // scale to divide groups
                    .domain(tickValues)

                select(this.axis)
                    .call(axisBottom(groupScale))
                    .selectAll(".tick text")
                    .call(this._wrap, groupScale.bandwidth(), this._calculateFontSize(width))

                break

            default:

                // No modifications necessary, use original scale
                select(this.axis).call(axisBottom(scale))
                break

        }

    }

    _wrap = (elements, width, fontSize) => {

        selectAll('.foreignObject-wrapper').remove()

        elements.each(function () {

            const text = select(this).attr('display', 'none')
            const y = text.attr('y')

            const foreignObject = select(this.parentElement)
                .append('foreignObject')
                .attr('class', 'foreignObject-wrapper')
                .attr('x', 0)
                .attr('y', y)
                .attr('width', width + 'px')
                .attr('height', 50)
                .attr('transform', 'translate(-' + (width / 2) + ',0)')
                .append("xhtml:div")
                .html(text.text())
                .attr('xmlns', 'http://www.w3.org/1999/xhtml')
                .attr('width', width + 'px')
                .style('font-size', fontSize + 'px')
                .style('text-align', 'center')
                .style('background-color', 'white')
                .style('font-family', "Roboto,'Droid Arabic Kufi','Helvetica Neue',Arial,Helvetica,sans-serif")

        })

    }

    _calculateFontSize = width => width < 800 ? 10 : width < 1200 ? 12 : 16

    render() {

        const {height, width, margin, axisType, label} = this.props

        const translate = 'translate(0,' + (height) + ')'
        const transform = axisType === 'x' ? translate : ''
        const textTransform = axisType === 'x' ?
            'translate(' + (width / 2) + ',' + ( margin.bottom) + ')' :
            'translate(' + (-margin.left) + ',' + (height / 2) + ')rotate(-90)'

        return (
            <g
                ref={(ref) => this.axis = ref}
                className={axisType + '-axis'}
                transform={transform}
                fontSize={this._calculateFontSize(width)}
            >
                <text
                    fill='#636363'
                    fontWeight='bold'
                    textAnchor='middle'
                    transform={textTransform}
                    y={axisType === 'x' ? -30 : 30}
                    fontSize={this._calculateFontSize(width)}
                >
                    {label}
                </text>
            </g>
        )

    }

}