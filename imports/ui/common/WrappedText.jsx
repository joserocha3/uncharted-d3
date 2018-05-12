import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {split} from 'lodash'

@inject('ui') @observer
export default class WrappedText extends Component {

    static defaultProps = {
        lineHeight: 1,
        capHeight: 0.71,
    }

    state = {
        lines: []
    }

    _calculateWordWidths = () => {

        const extraWidth = this.props.ui.language === 'en' ? 0 : 10

        // Calculate length of each word to be used to determine number of words per line

        const words = this.props.text.split(/\s+/)
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        var text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        Object.assign(text.style, this.props.style)
        svg.appendChild(text)
        document.body.appendChild(svg)

        const wordsWithComputedWidth = words.map(word => {
            text.textContent = word
            return {word, width: text.getComputedTextLength() + extraWidth}
        })

        text.textContent = '\u00A0' // Unicode space
        const spaceWidth = text.getComputedTextLength() + extraWidth

        document.body.removeChild(svg)

        return {wordsWithComputedWidth, spaceWidth}

    }

    _calculateLines = (wordsWithComputedWidth, spaceWidth, lineWidth) => {

        const wordsByLines = wordsWithComputedWidth.reduce((result, {word, width}) => {

            const lastLine = result[result.length - 1] || {words: [], width: 0}

            if (lastLine.words.length === 0) {
                // First word on line
                const newLine = {words: [word], width}
                result.push(newLine)
            } else if (lastLine.width + width + (lastLine.words.length * spaceWidth) < lineWidth) {
                // Word can be added to an existing line
                lastLine.words.push(word)
                lastLine.width += width
            } else {
                // Word too long to fit on existing line
                const newLine = {words: [word], width}
                result.push(newLine)
            }

            return result

        }, [])

        return wordsByLines.map(line => line.words.join(' '))
    }

    componentWillMount() {

        const {width} = this.props

        const {wordsWithComputedWidth, spaceWidth} = this._calculateWordWidths()
        this.wordsWithComputedWidth = wordsWithComputedWidth
        this.spaceWidth = spaceWidth

        const lines = this._calculateLines(this.wordsWithComputedWidth, this.spaceWidth, width)
        this.setState({lines})

    }

    componentDidUpdate(nextProps, nextState) {

        if (this.props.text != nextProps.text) {
            const {wordsWithComputedWidth, spaceWidth} = this._calculateWordWidths()
            this.wordsWithComputedWidth = wordsWithComputedWidth
            this.spaceWidth = spaceWidth
        }

        const lines = this._calculateLines(this.wordsWithComputedWidth, this.spaceWidth, this.props.width)
        const newLineAdded = this.state.lines.length !== lines.length
        const wordMoved = this.state.lines.some((line, index) => {
            if (!lines[index]) return true
            return line.length != lines[index].length || 0;
        })

        if (this.props.text != nextProps.text) {
            // Update if text has changed
            this.setState({lines})
        } else if (newLineAdded || wordMoved) {
            // Update if number of lines or length of any lines change
            this.setState({lines})
        }

    }

    render() {

        const {capHeight, fontSize, lineHeight, textAnchor, ui, width, x, y} = this.props
        const {lines} = this.state

        return (
            <text textAnchor={textAnchor} x={x} y={y} width={width} dy={`${capHeight}em`} fontSize={fontSize}>

                {lines.map((word, index) => {

                    const parts = split(word, 'VS', 2)

                    return parts.length === 1 ? (
                            <tspan x={x} y={y} dy={`${index * lineHeight}em`} key={index}>
                                {word}
                            </tspan>
                        ) : (
                            <tspan x={x} y={y} dy={`${index * lineHeight}em`} key={index}>
                                {parts[0]}
                                <tspan id='chart-title-vs'> VS</tspan>
                                {parts[1]}
                            </tspan>
                        )

                })}

            </text>
        )

    }
}