/*-------------------------------------------------------------------------*
 * Object name:   ChartTitle.jsx
 * Created by:    Pablo Rocha
 * Creation date: 06/19/2017
 * Description:   What to render as the chart title
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #19.3  06/19/2017  Pablo Rocha  - Remove subtitle
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {inject, observer} from 'mobx-react'
import {Header} from 'semantic-ui-react'

// Components
import TAP from './TAP'

@inject('records') @observer
export default class ChartTitle extends React.Component {

    render() {

        const {height, width, records} = this.props

        let header = <TAP translate='arab_knowledge_index'/>

        if (records.chartYear === 2015) header = <TAP translate='arab_knowledge_index_2015'/>
        if (records.chartYear === 2016) header = <TAP translate='arab_knowledge_index_2016'/>

        return (
            <foreignObject width={width} height={height}>
                <div xmlns='http://www.w3.org/1999/xhtml' style={{height: height, overflow: 'hidden'}}>
                    <Header id='chart-title' as='h2' textAlign='center'>
                        {header}
                    </Header>
                </div>
            </foreignObject>
        )

    }

}