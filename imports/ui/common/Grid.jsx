import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {axisLeft, select, axisBottom} from 'd3'

export default class Grid extends Component {

    static propTypes = {
        scale: PropTypes.func.isRequired,
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        gridType: PropTypes.oneOf(['horizontal', 'vertical']).isRequired
    }

    componentDidMount() {
        this._renderGrid()
    }

    componentDidUpdate() {
        this._renderGrid()
    }

    _renderGrid() {

        const {height, width, scale, gridType} = {...this.props};

        if (gridType === 'horizontal') {

            const grid = axisLeft(scale)
                .tickSize(-width, 0, 0)
                .tickFormat('')

            select(this.grid)
                .attr('class', 'grid')
                .call(grid)

        } else if (gridType === 'vertical') {

            const grid = axisBottom(scale)
                .tickSize(-height, 0, 0)
                .tickFormat('')

            select(this.grid)
                .attr('class', 'grid')
                .call(grid)

        }

    }

    render() {

        const {height, gridType} = {...this.props};

        const transform = 'translate(0,' + height + ')';

        return (
            <g
                ref={(ref) => this.grid = ref}
                className="grid"
                transform={gridType === 'horizontal' ? '' : transform}
            />
        )

    }
}