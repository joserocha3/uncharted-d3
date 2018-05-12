/*-------------------------------------------------------------------------*
 * Object name:   ui.js
 * Created by:    Pablo Rocha
 * Creation date: ???
 * Description:   Ui store methods and classes
 *-------------------------------------------------------------------------
 * Modification history:
 * Branch  Issue  Date        Developer    Description of change
 * master  #16.1  06/09/2017  Pablo Rocha  - Add groupToggle functionality
 * master  #16.2  06/12/2017  Pablo Rocha  - Set chartTitle to possibly have indicators list
 * master  #18.1  06/12/2017  Pablo Rocha  - Legend deselect determines available charts
 * master  #14.1  06/13/2017  Pablo Rocha  - Add presentationMode logic
 * master  #15.1  06/14/2017  Pablo Rocha  - Remove chart margins object, no longer used
 * master  #15.2  06/14/2017  Pablo Rocha  - Set chartTitle for line chart
 * master  #19.3  06/19/2017  Pablo Rocha  - Add onChartLegendHeight logic, used in OnChartLegend.jsx to set height
 *                                         - Remove chartTitle since we export country/indicator list with legend now
 *-------------------------------------------------------------------------*/

// Libs
import {action, computed, observable} from 'mobx'
import {FlowRouter} from 'meteor/kadira:flow-router'
import i18next from 'i18next'

// Files
import i18n from '../startup/client/i18n'

class Ui {

    constructor() {
        i18next.init({lng: 'en', resources: i18n})
    }

    /*
     * Chart UI
     */

    @observable activeNavigationMenuItem = 'chart'
    @observable activeChartMenuItem = null
    @observable activeIndexMenuItem = null
    @observable visibleSidebar = null
    @observable barDisabled = true
    @observable lineDisabled = true
    @observable radarDisabled = true
    @observable scatterDisabled = true
    @observable groupToggle = 'country'
    @observable presentationMode = false
    @observable onChartLegendHeight = 0
    @observable chartDimensions = {height: 650, width: 500}

    @action navigationMenuItemClicked = name => this.activeNavigationMenuItem = name || null
    @action adminMenuItemClicked = name => this.activeAdminMenuItem = name || null
    @action chartMenuItemClicked = name => this.activeChartMenuItem = name || null
    @action setGroupToggle = toggleBy => this.groupToggle = toggleBy || null
    @action setPresentationMode = on => this.presentationMode = on || false
    @action setOnChartLegendHeight = height => this.onChartLegendHeight = height || 0

    @action indexMenuItemClicked = name => {
        this.activeIndexMenuItem = this.activeIndexMenuItem === name ? null : name
        this.visibleSidebar = this.activeIndexMenuItem
    }

    @action closeSidebars = () => {
        this.activeIndexMenuItem = null
        this.visibleSidebar = null
    }

    @action setDisabled = () => {

        // Set chart menu items to disabled or not based on if they are selected in the legend, the
        // legend selecting/deselecting sets the draw variable

        const countriesLength = stores.countries.drawAndRecordsIds.length
        const indicatorsLength = stores.indicators.drawAndRecordsIds.length

        this.barDisabled = !((countriesLength >= 1 && indicatorsLength >= 1))
        this.lineDisabled = !((countriesLength >= 1 && indicatorsLength >= 1) || (indicatorsLength >= 1 && countriesLength >= 1))
        this.radarDisabled = !((countriesLength >= 1 && indicatorsLength >= 3) || (indicatorsLength >= 1 && countriesLength >= 3))
        this.scatterDisabled = !((countriesLength >= 1 && indicatorsLength === 2))

        const disable = () => {
            this.chartMenuItemClicked()
            FlowRouter.go('/' + this.language + '/chart/')
        }

        switch (FlowRouter.current().route.name) {
            case 'bar':
                if (this.barDisabled) disable()
                break
            case 'line':
                if (this.lineDisabled) disable()
                break
            case 'radar':
                if (this.radarDisabled) disable()
                break
            case 'scatter':
                if (this.scatterDisabled) disable()
                break
        }

        if (this.barDisabled &&
            this.lineDisabled &&
            this.radarDisabled &&
            this.scatterDisabled) {
            this.chartMenuItemClicked()
        }

    }

    @action setChartDimensions = (width, height) => {
        this.chartDimensions.width = width
        this.chartDimensions.height = height
    }

    /*
     * Admin UI
     */

    @observable activeAdminMenuItem
    @observable activeAdminModal
    @observable showIdColumn = false
    @observable showCreatedColumns = false
    @observable showChangedColumns = false
    @observable showDeleteColumn = false
    @observable colorPickerValue = '#0fada6'
    @observable dropZoneFlagFiles = []
    @observable dropZoneHeaderFiles = []
    @observable dropZoneMapFiles = []
    @observable formSubmitting = false

    @action setShowIdColumn = checked => this.showIdColumn = checked
    @action setShowCreatedColumns = checked => this.showCreatedColumns = checked
    @action setShowChangedColumns = checked => this.showChangedColumns = checked
    @action setShowDeleteColumn = checked => this.showDeleteColumn = checked
    @action setActiveAdminModal = modal => this.activeAdminModal = modal
    @action setColorPickerValue = color => this.colorPickerValue = color
    @action setDropZoneFlagFiles = files => this.dropZoneFlagFiles = files
    @action setDropZoneHeaderFiles = files => this.dropZoneHeaderFiles = files
    @action setDropZoneMapFiles = files => this.dropZoneMapFiles = files
    @action setFormSubmitting = submitting => this.formSubmitting = submitting

    /*
     * Misc UI
     */

    @observable errorMessages = []
    @observable language = 'en'

    @action setErrorMessages = messages => this.errorMessages.replace(messages)

    /*
     *  Language and translations
     */

    @action languageClicked = () => {

        this.language = this.language === 'en' ? 'ar' : 'en'

        switch (this.activeNavigationMenuItem) {

            case 'chart':
                FlowRouter.go('/' + this.language + '/' + FlowRouter.current().route.group.name + '/' + (this.activeChartMenuItem || '')) // activeChartMenuItem might be null so use '' instead
                break

            case 'profile':
                FlowRouter.go('/' + this.language + '/profile')
                break

            case 'infographic':
                FlowRouter.go('/' + this.language + '/infographic')
                break

            case 'sponsors':
                FlowRouter.go('/' + this.language + '/sponsors')
                break

        }

    }

    @action setLanguage = language => {

        if (i18next.language) {

            this.language = language
            i18next.changeLanguage(this.language)

            document.getElementById('en-styles').disabled = this.language === 'ar'
            document.getElementById('ar-styles').disabled = this.language === 'en'

        }

    }

    // ignore language, only passed to trigger TAP re-render
    translate = (translate, language) => i18next.exists(translate) ? i18next.t(translate) : translate

    /*
     *  Admin table sorting
     */

    @observable tableSortedAscendingColumn = 'nameEn'
    @observable tableSortedDescendingColumn = ''

    @action setTableSortedAscendingColumn = column => this.tableSortedAscendingColumn = column
    @action setTableSortedDescendingColumn = column => this.tableSortedDescendingColumn = column

}

export default new Ui()