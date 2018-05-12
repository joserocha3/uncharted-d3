import React, {Component} from 'react';
import PropTypes from 'prop-types'

// BigYear component - Display current year
export default class BigYear extends Component {

    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        year: PropTypes.number.isRequired
    }

    render() {

        const {x, y, year} = {...this.props};

        const transform = 'translate(' + x + ',' + y + ')';

        return (
            <g
                className={'big-year'}
                transform={transform}>
                <text
                    fill='#636363'
                    fillOpacity={.35}
                    fontSize={100}
                    textAnchor='end'>
                    {year}
                </text>
            </g>
        )

    }

}