import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

import TAP from './TAP'

const FormSelectIndex = inject('indicators')(observer(({indicators}) =>

    <Form.Select
        label={<TAP translate='index'/>}
        value={indicators.selectedIndexIds.slice()}
        onChange={(event, data) => indicators.setSelectedIndexIds(data.value)}
        name='indexes'
        options={indicators.dropdownIndexOptions}
        search
        multiple
    />

))

export default FormSelectIndex