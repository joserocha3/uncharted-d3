import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import TAP from './TAP'

const FormSelectIso = inject('countries')(observer(({countries}) =>

    <Form.Select
        label={<TAP translate='iso'/>}
        value={countries.selectedIsoIds.slice()}
        onChange={(event, data) => countries.setSelectedIsoIds(data.value)}
        name='isos'
        options={countries.dropdownIsoOptions}
        search
        multiple
    />

))

export default FormSelectIso