import React from 'react'
import DevTools from 'mobx-react-devtools'

const MobxDevTools = () => Meteor.settings.public.showDevTools ? <DevTools/> : <div/>

export default MobxDevTools