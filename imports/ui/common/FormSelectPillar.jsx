import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import TAP from './TAP'

const FormSelectPillar = inject('indicators')(observer(({indicators}) =>

    <Form.Select
        label={<TAP translate='pillar'/>}
        value={indicators.selectedPillarIds.slice()}
        onChange={(event, data) => indicators.setSelectedPillarIds(data.value)}
        name='pillars'
        options={indicators.dropdownPillarOptions}
        search
        multiple
    />

))

export default FormSelectPillar