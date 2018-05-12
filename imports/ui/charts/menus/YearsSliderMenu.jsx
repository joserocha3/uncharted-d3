import React from 'react'
import {Menu} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import Slider from 'rc-slider';
import {range, isArrayLike} from 'lodash'

import TAP from '../../common/TAP'

@inject('records', 'ui') @observer
export default class YearsSliderMenu extends React.Component {

    state = {value: [2015, 2015]}

    _handleOnChange = years => {
        const {records} = this.props
        records.setYearsToFind(range(years[0], years[1] + 1))
        records.updateRecordsDataForChart()
    }

    render() {

        const {ui} = this.props

        const sliderStyle = {
            height: 400,
            marginLeft: 15,
            marginTop: 15
        }

        let slider

        if (ui.activeChartMenuItem === 'bar' ||
            ui.activeChartMenuItem === 'line') {
            slider =
                <Slider
                    disabled={false}
                    range
                    vertical
                    min={2000}
                    max={2016}
                    step={1}
                    value={this.state.value}
                    onChange={(value) => {
                        this._handleOnChange(value)
                        this.setState({value: value})
                    }}
                    handle={<CustomHandle/>}
                />
        } else {
            slider =
                <Slider
                    disabled={false}
                    vertical
                    min={2000}
                    max={2016}
                    step={1}
                    defaultValue={this.state.value[1]}
                    value={this.state.value[1]}
                    onChange={(value) => {
                        if (isArrayLike(value)) {
                            // Happens when the draw value switches because of (de)selecting indicators
                            this._handleOnChange([this.state.value[0], value[1]])
                            this.setState({value: [this.state.value[0], value[1]]})
                        } else {
                            this._handleOnChange([this.state.value[0], value])
                            this.setState({value: [this.state.value[0], value]})
                        }
                    }}
                    handle={<CustomHandle/>}
                />
        }

        slider =
            <Slider
                disabled={false}
                vertical
                min={2000}
                max={2016}
                step={1}
                defaultValue={this.state.value[1]}
                value={this.state.value[1]}
                onChange={(value) => {
                    if (isArrayLike(value)) {
                        // Happens when the draw value switches because of (de)selecting indicators
                        this._handleOnChange([this.state.value[0], value[1]])
                        this.setState({value: [this.state.value[0], value[1]]})
                    } else {
                        this._handleOnChange([this.state.value[0], value])
                        this.setState({value: [this.state.value[0], value]})
                    }
                }}
                handle={<CustomHandle/>}
            />

        return (
            <Menu
                icon='labeled'
                vertical
                fixed='left'
                id='slider-menu'
            >

                <Menu.Item header><TAP translate='years'/></Menu.Item>

                <Menu.Item>
                    <div style={sliderStyle}>{slider}</div>
                </Menu.Item>

            </Menu>
        )

    }

}

class CustomHandle extends React.Component {

    render() {

        const {offset, value} = {...this.props};

        const handleStyle = {
            marginLeft: -17,
            position: 'absolute',
            cursor: 'pointer',
            bottom: offset - 4 + '%',
            width: 66,
            height: 32,
            color: '#ffffff',
            backgroundColor: '#363a44',
            lineHeight: '33px',
            borderRadius: 3
        }

        return (
            <div style={handleStyle}>
                {value}
            </div>
        )

    }

}