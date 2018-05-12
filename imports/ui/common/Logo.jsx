import React from 'react'

export default class Logo extends React.Component {

    render() {

        const {admin} = this.props

        return (
            <a id='logo' href=''>
                <span style={{fontWeight: 'bold'}}>u</span>
                <span>charted</span>
                <span style={{color: '#00adc6'}}>-</span>
                <span style={{fontWeight: 'bold'}}>d3</span> {admin ? ': Admin' : ''}
            </a>
        )

    }

}
