/*-------------------------------------------------------------------------*
 * Object name: NoDataFound
 * Created by:  Pablo Rocha
 * Description: Used in place of chart to signify no data is found.
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import TAP from '../common/TAP'

const NoDataFound = () =>
    <div style={{padding: 77}}>
        <div style={{backgroundColor: '#d6d6d6', height: 500, textAlign: 'center', paddingTop: 200, fontWeight: 'bold'}}>
            <span style={{color: '#ffffff', fontSize: 72}}><TAP translate='no_data_found'/></span>
            <br/><br/><br/>
            <span style={{color: '#363a44', fontSize: 24}}><TAP translate='change_your_selection'/></span>
        </div>
    </div>

export default NoDataFound