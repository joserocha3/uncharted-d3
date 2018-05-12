// Libs
import React from 'react'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import {select, arc, format} from 'd3'

// Bar chart - Component displayed when bar chart is selected
@inject('countries', 'records', 'ui') @observer
export default class DonutChart extends React.Component {

    static propTypes = {
        percent: PropTypes.number,
        color: PropTypes.string
    }

    static defaultProps = {}

    handle = null
    arc = null

    componentDidMount() {
        window.addEventListener('scroll', this._animate)
        this._animate()
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._animate)
        Meteor.clearInterval(this.handle)
    }

    _isInViewport = () => {
        const rect = this.parent.getBoundingClientRect();
        const html = document.documentElement;
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || html.clientHeight) &&
            rect.right <= (window.innerWidth || html.clientWidth)
        );
    }

    _animate = () => {

        if (!this._isInViewport()) return
        window.removeEventListener('scroll', this._animate)

        const {percent} = this.props

        const startPercent = 0
        const endPercent = percent
        const twoPi = Math.PI * 2
        const step = endPercent < startPercent ? -0.01 : 0.01

        let count = Math.abs((endPercent - startPercent) / 0.01)
        let progress = startPercent

        this.handle = Meteor.setInterval(() => {

            select(this.foreground).attr('d', this.arc.endAngle(twoPi * progress))

            if (count > 0) {
                count--;
                progress += step
            } else {
                Meteor.clearInterval(this.handle)
            }

        }, 10)

        select(this.background).attr('d', this.arc.endAngle(twoPi))
    }

    render() {

        const {color, percent} = this.props

        const radius = 85
        const border = 20
        const padding = 0
        const boxSize = (radius + padding) * 2

        this.arc = arc()
            .startAngle(0)
            .innerRadius(radius)
            .outerRadius(radius - border)
            .cornerRadius(50)

        return (
            <div className="radial" ref={ref => this.parent = ref}>
                <svg width={boxSize} height={boxSize} style={{backgroundColor: '#f8f9fb'}}>
                    <g transform={'translate(' + boxSize / 2 + ',' + boxSize / 2 + ')'}>
                        <g className='progress-meter'>
                            <path
                                ref={ref => this.background = ref}
                                className='background'
                                fill='#e7e7e7'
                                fillOpacity={1}
                            ></path>
                            <path
                                ref={ref => this.foreground = ref}
                                className='foreground'
                                fill={color}
                                fillOpacity={1}
                            ></path>
                            <text
                                fill='#bbbbbb'
                                textAnchor='middle'
                                dy='.278em'
                                className='radial-text'
                                fontSize={30}
                            >
                                {format('.2%')(percent)}
                            </text>
                        </g>
                    </g>
                </svg>
            </div>
        )

    }

}