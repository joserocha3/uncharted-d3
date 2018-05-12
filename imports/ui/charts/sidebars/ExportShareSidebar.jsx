/*-------------------------------------------------------------------------*
 * Object name:   ExportShare.jsx
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Render Sidebar for export/share menu and handle any functionality
 *                required to export/share the data/chart
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #19.1  06/16/2017  Pablo Rocha  - Replace CSV creation with HTML
 * master  #19.2  06/17/2017  Pablo Rocha  - Namespace and MIME type updates for Arabic compatibility
 * master  #19.3  06/19/2017  Pablo Rocha  - Pass 1 to PNG encoderOptions for highest resolution
 * master  #11.1  07/01/2017  Pablo Rocha  - Update source text, rename methods
 *-------------------------------------------------------------------------*/

// Libs
import React from 'react'
import {Grid, List, Sidebar} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'
import {groupBy, keys} from 'lodash'
import jsxToString from 'jsx-to-string'
import moment from 'moment'

// Files
import i18n from '../../../startup/client/i18n'
import {saveSvgAsPng} from '../../../startup/client/saveSvgAsPng'

// Components
import TAP from '../../common/TAP'

@inject('records', 'ui') @observer
export default class ExportShareSidebar extends React.Component {

    _isEven = n => n % 2 == 0

    _convertToExcel = () => {

        const {records, ui} = this.props
        const recordsData = records.recordsWithCountryAndIndicatorData || []
        const countryNames = keys(groupBy(recordsData, 'countryName'))
        const indicatorNames = keys(groupBy(recordsData, 'indicatorName'))

        if (recordsData.length === 0)  return

        const headerRow = (
            <tr>
                <td style='vertical-align:middle; background-color:#99ccff; width: 100px;'>
                    <b>{ui.language === 'en' ? i18n.en.translation.country : i18n.ar.translation.country}</b>
                </td>
                {indicatorNames.map((name, index) =>
                    <td key={name} style={'vertical-align:middle; ' + 'background-color:' + (this._isEven(index) ? '#33cccc' : '#99ccff') + '; width: 100px;'}>
                        <b>{name}</b>
                    </td>
                )}
            </tr>
        )

        const dataRows = countryNames.map(name =>
            <tr key={name}>
                <td>{name}</td>
                {recordsData.filter(r => r.countryName === name).map(record =>
                    <td key={record.indicatorName} style='background-color:#ccffff;'>{record.value || '-'}</td>
                )}
            </tr>
        )

        const output = (

            <div>
                <table border='0'>
                    <tr>
                        <td colspan={(indicatorNames.length + 1).toString()} style='font-weight:bold; font-size:16px;'>
                            {'' + ui.language === 'en' ?
                                i18n.en.translation.arab_knowledge_index + ' ' + records.chartYear :
                                records.chartYear + ' ' + i18n.ar.translation.arab_knowledge_index
                            }
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Last Updated</td>
                        <td>{moment(Date.now()).format('lll')}</td>
                        <td></td>
                    </tr>
                </table>
                <table border='1'>
                    {headerRow}
                    {dataRows}
                    <tr>
                        <td border='0'></td>
                        <td style='background-color:#f2f2f2;' colspan={indicatorNames.length.toString()}><b>Source</b>:UNDP & MBRF 2016</td>
                    </tr>
                </table>
            </div>
        )

        const startHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><head><meta http-equiv='content-type' content='application/vnd.ms-excel; charset=UTF-8'></head><body>`
        const endHtml = `</body></html>`
        const link = document.createElement('a')

        link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8,\uFEFF,' + (encodeURIComponent(startHtml + jsxToString(output) + endHtml))
        link.style = 'visibility:hidden'
        link.download = 'exported_data.xls'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

    }

    _saveSvgAsPng = () => saveSvgAsPng(document.getElementById('svg-chart'), 'chart.png', {encoderOptions: 1})

    render() {

        const {visible} = this.props

        return (
            <Sidebar
                className='margin-240'
                animation='overlay'
                direction='left'
                visible={visible}
            >

                <Grid columns={1} padded>
                    <Grid.Column>

                        <List selection verticalAlign='middle' relaxed='very'>

                            <List.Item onClick={this._convertToExcel}>
                                <List.Icon name='file excel outline' color='green'/>
                                <List.Content>
                                    <List.Header><TAP translate='excel'/></List.Header>
                                    <TAP translate='save_as_spreadsheet'/>
                                </List.Content>
                            </List.Item>

                            <List.Item onClick={this._saveSvgAsPng}>
                                <List.Icon name='picture' color='purple'/>
                                <List.Content>
                                    <List.Header><TAP translate='png'/></List.Header>
                                    <TAP translate='save_as_png'/>
                                </List.Content>
                            </List.Item>

                        </List>

                    </Grid.Column>
                </Grid>

            </Sidebar>
        )

    }

}