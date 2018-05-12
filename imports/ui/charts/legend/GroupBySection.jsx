/*-------------------------------------------------------------------------*
 * Object name:   GroupBySection.jsx
 * Created by:    Pablo Rocha
 * Creation date: 07/12/2017
 * Description:   Component to display a section of the Legend.jsx component.
 *
 *                This section contains the option to change the way a chart
 *                is rendered by toggling between country and indicator groupings.
 *
 *                BarChart: If grouped by country then each bar represents an
 *                indicator, vice versa.
 *
 *                We pass a className of 'checked' to the Checkbox component
 *                so it always appears selected
 *-------------------------------------------------------------------------*
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #16    07/12/2017  Pablo Rocha  - Original release
 *-------------------------------------------------------------------------*/

// Libs
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Checkbox, Divider, List} from 'semantic-ui-react'

// Components
import TAP from '../../common/TAP'

export default class GroupBySection extends Component {

    static propTypes = {
        checked: PropTypes.bool,
        onChange: PropTypes.func.isRequired
    }

    static defaultProps = {
        checked: false
    }

    render() {

        const {checked, onChange} = this.props

        return (
            <List relaxed>

                <List.Item>
                    <List.Header>
                        <TAP translate='group_by'/><br/>
                    </List.Header>
                    <Divider fitted/>
                </List.Item>

                <List.Item
                    content={
                        <div>
                            <TAP translate='country'/>&nbsp;&nbsp;
                            <Checkbox
                                className='checked'
                                toggle
                                checked={checked}
                                onChange={onChange}
                            />
                            &nbsp;&nbsp;<TAP translate='indicator'/>
                        </div>
                    }
                />

            </List>
        )

    }

}