import React from 'react'
import {Provider} from 'mobx-react'

import MobxDevTools from '../common/MobxDevTools'
import Alert from '../common/Alert'

import stores from '../../stores/stores'

const ui = stores.ui
const countries = stores.countries
const indicators = stores.indicators
const records = stores.records
const users = stores.users

const MainLayout = ({content}) => (
    <Provider
        ui={ui}
        countries={countries}
        indicators={indicators}
        records={records}
        users={users}
    >
        <div id='main-layout'>
            {content}
            <MobxDevTools/>
            <Alert/>
        </div>
    </Provider>
)

export default MainLayout