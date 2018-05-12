import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import TAP from './TAP'

const FormSelectSubpillar = inject('indicators')(observer(({indicators}) =>

    <Form.Select
        label={<TAP translate='subpillar'/>}
        value={indicators.selectedSubpillarIds.slice()}
        onChange={(event, data) => indicators.setSelectedSubpillarIds(data.value)}
        name='subpillars'
        options={indicators.dropdownSubpillarOptions}
        search
        multiple
    />

))

export default FormSelectSubpillar