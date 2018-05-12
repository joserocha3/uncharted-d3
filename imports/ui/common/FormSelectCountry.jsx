import React from 'react'
import {Form} from 'semantic-ui-react'
import {inject, observer} from 'mobx-react'

const FormSelectCountry = inject('countries')(observer(({countries}) =>

    <Form.Select
        label='Country'
        value={countries.selectedCountryIds.slice()}
        onChange={(event, data) => countries.setSelectedCountryIds(data.value)}
        name='countries'
        options={countries.dropdownCountryOptions}
        search
        multiple
    />

))

export default FormSelectCountry