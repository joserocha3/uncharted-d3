/*-------------------------------------------------------------------------*
 * Object name:   Dots.jsx
 * Created by:    Pablo Rocha
 * Creation date: ????
 * Description:   Group of dots to render on a chart
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #15.1  06/14/2017  Pablo Rocha  - Rewrite to make it more generic to allow
 *                                           use from scatter and line charts
 * master  #15.4  06/15/2017  Pablo Rocha  - Round value to 2 decimal places
 *-------------------------------------------------------------------------*/

// Libs
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Popup, List, Divider} from 'semantic-ui-react'
import {round} from 'lodash'
import {transition, easeLinear, selectAll} from 'd3'

import TAP from '../common/TAP'

export default class Dots extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        x: PropTypes.func.isRequired,
        y: PropTypes.func.isRequired
    }

    static defaultProps = {}

    componentDidMount() {
        this._tweenDots()
    }

    componentDidUpdate() {
        this._tweenDots()
    }

    _tweenDots = () => {

        var t = transition()
            .duration(200)
            .ease(easeLinear)

        selectAll('circle.dot').transition(t)
            .attr('r', function () {
                return this.getAttribute('data-toR')
            })

    }

    render() {

        let {data, x, y} = this.props

        return (
            <g className='dots'>
                {data.map(d => {

                    const trigger =
                        <circle
                            className={'dot'}
                            r='0'
                            data-toR={d.radius}
                            cx={x(d.cx)}
                            cy={y(d.cy)}
                            fill={d.headerColor}
                            strokeOpacity={0}
                            stroke={d.headerColor}
                            strokeWidth={10 + 'px'}
                            onMouseOver={e => e.target.setAttribute('stroke-opacity', '0.2')}
                            onMouseOut={e => e.target.setAttribute('stroke-opacity', '0')}
                        />

                    const content =
                        <List>
                            <List.Header>
                                <div style={{color: d.headerColor}}>{d.headerText} {d.year}</div>
                            </List.Header>
                            <Divider fitted/>
                            {d.items.map((item, index) => (
                                <List.Item key={index}>
                                    <span style={{color: item.color}}>{item.text === 'population' ? <TAP translate='population'/> : item.text}</span>&nbsp;&nbsp;&nbsp;{!item.value ? '-' : round(item.value, 2)}
                                </List.Item>
                            ))}
                        </List>

                    return (
                        <Popup
                            key={d.key}
                            style={{border: 'solid ' + d.headerColor + ' 1px'}}
                            flowing
                            hoverable
                            className='line-chart-popup'
                            on='hover'
                            position='top center'
                            trigger={trigger}
                            content={content}/>
                    )

                })}
            </g>
        )

    }

}