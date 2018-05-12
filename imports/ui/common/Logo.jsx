import React from 'react'

export default class Logo extends React.Component {

    render() {

        const {admin} = this.props

        return (
            <a id='logo' href=''>
                <span style={{fontWeight: 'bold'}}>K</span>
                <span>nowledge</span>
                <span style={{color: '#00adc6'}}>4</span>
                <span style={{fontWeight: 'bold'}}>All</span> {admin ? ': Admin' : ''}
            </a>
        )

    }

}
