import { LightningElement, wire } from 'lwc';
import {getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';
import CAR_OBJECT from '@salesforce/schema/Car__c';

/* car schema */
import CATEGORY_OBJECT from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';

/* constants */
const CATEGORY_ERROR = 'Error loading categories'
const MAKE_ERROR = 'Error loading make types'

export default class CarFilter extends LightningElement {

    filters={
        searchKey:'',
        maxPrice:999999
    }
    categoryError=CATEGORY_ERROR
    makeError=MAKE_ERROR

    @wire(getObjectInfo, {objectApiName:CAR_OBJECT})
    carObjectInfo

    @wire(getPicklistValues, {
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:CATEGORY_OBJECT
    })categories

    @wire(getPicklistValues, {
        recordTypeId:'$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName:MAKE_FIELD
    })makeType

    /* search key handler*/
    handleSearchKeyChange(event){
        console.log('search key handler>>>', event.target.value)
        this.filters = {...this.filters, 'searchKey':event.target.value}
    }

    /* price key handler*/
    handleMaxPriceChange(event){
        console.log('price key handler>>>', event.target.value)
        this.filters = {...this.filters, 'maxPrice':event.target.value}
    }

    handleCheckbox(event){
        const {name, value} = event.target.dataset
        console.log('name', name)
        console.log('value', value)
    }
}