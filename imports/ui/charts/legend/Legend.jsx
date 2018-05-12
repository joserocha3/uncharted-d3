// Libs
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Divider, List} from 'semantic-ui-react'

// Components
import Item from './Item'
import TAP from '../../common/TAP'

// Legend component - legend to appear next to the chart, used to filter chart component
export default class Legend extends Component {

    static propTypes = {
        title: PropTypes.string,
        subtitle: PropTypes.string,
        list: PropTypes.array.isRequired,
        itemStore: PropTypes.any.isRequired,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        title: '',
        subtitle: 'click_to_select_deselect',
        disabled: false
    }

    render() {

        const {disabled, title, subtitle, list, itemStore} = this.props

        return (
            <List relaxed>

                <List.Item>
                    {title ?
                        <List.Header>
                            <TAP translate={title}/><br/>
                        </List.Header> : null
                    }
                    {subtitle ?
                        <span>
                            <TAP translate={subtitle}/>
                        </span> : null
                    }
                    <Divider fitted/>
                </List.Item>

                {list.map(item =>
                    <Item
                        key={item._id}
                        itemStore={itemStore}
                        item={item}
                        disabled={disabled}
                    />
                )}

            </List>
        )

    }

}