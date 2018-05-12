import React from 'react'
import {Image, Grid} from 'semantic-ui-react'

import TAP from './TAP'

export default class Footer extends React.Component {

    render() {

        return (
            <div id='footer'>

                <Grid padded columns='equal' className='footer-grid-bottom'>

                    <Grid.Row verticalAlign='middle'>

                        <Grid.Column>
                            <TAP translate='footer'/>
                        </Grid.Column>

                        <Grid.Column>
                            <Image
                                floated='right'
                                src='/../images/name.png'
                                alt='name'
                                height='30'
                            />
                        </Grid.Column>

                    </Grid.Row>

                </Grid>
            </div>
        )

    }

}