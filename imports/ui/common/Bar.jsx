import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TransitionGroup from 'react-addons-transition-group'
import {Divider, List, Popup} from 'semantic-ui-react'
import TweenMax from 'gsap'

// Bar - this is an individual rect for a bar chart, we need to use TransitionGroup and separate component for the rect to be a Popup trigger
export default class Bar extends Component {

    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        classed: PropTypes.string,
        fill: PropTypes.string,
        transform: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.object
    }

    static defaultProps = {
        classed: 'bar',
        fill: '7dc7f4',
        transform: 'translate(0,0)'
    }

    state = {mounted: false}

    componentDidMount() {
        this.setState({mounted: true})
    }

    render() {

        const {classed, fill, header, height, items, onClick, style, transform, value, width, x} = this.props
        const {mounted} = this.state

        return (
            <Popup
                style={{border: 'solid ' + fill + ' 1px'}}
                flowing
                basic
                hoverable
                className='bar-chart-popup'
                on='hover'
                position='top center'
                trigger={
                    <TransitionGroup component='g'>
                        {mounted ?
                            <Rect
                                key={value}
                                value={value}
                                transform={transform}
                                className={classed}
                                x={x}
                                y={0}
                                fill={fill}
                                height={height}
                                width={width}
                                onClick={onClick}
                                style={style}
                            /> : null
                        }
                    </TransitionGroup>
                }
                children={
                    <List>
                        {header}
                        <Divider fitted/>
                        {items}
                    </List>
                }
            >
            </Popup>
        )

    }
}

class Rect extends Component {

    static propTypes = {
        x: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        classed: PropTypes.string,
        fill: PropTypes.string,
        transform: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.object
    }

    componentDidUpdate(prevProps, prevState) {
        const {height} = this.props
        if (height !== prevProps.height) TweenMax.to(this.rect, 0.3, {height: height})
    }

    componentDidMount() {
        window.addEventListener('scroll', this._animate)
        this._animate()
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._animate)
    }

    _animate = () => {

        if (!this._isInViewport()) return
        window.removeEventListener('scroll', this._animate)

        const {height} = this.props
        TweenMax.to(this.rect, 0.3, {opacity: 1, attr: {height: height}})

    }

    _isInViewport = () => {
        const rect = this.rect.getBoundingClientRect();
        const html = document.documentElement;
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || html.clientHeight) &&
            rect.right <= (window.innerWidth || html.clientWidth)
        );
    }

    render() {

        const {transform, classed, x, fill, onClick, style, width, value} = this.props

        return (
            <rect
                key={value}
                transform={transform}
                ref={ref => this.rect = ref}
                className={classed}
                x={x}
                y={0}
                fill={fill}
                height={0}
                width={width}
                onClick={onClick}
                style={style}
            />
        )

    }

}