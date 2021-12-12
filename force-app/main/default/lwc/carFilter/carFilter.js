import { LightningElement, wire } from 'lwc';
import {getObjectInfo, getPicklistValues} from 'lightning/uiObjectInfoApi';
import CAR_OBJECT from '@salesforce/schema/Car__c';

/* car schema */
import CATEGORY_OBJECT from '@salesforce/schema/Car__c.Category__c';
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c';

/* constants */
const CATEGORY_ERROR = 'Error loading categories'
const MAKE_ERROR = 'Error loading make types'

/* lms */
import {publish,MessageContext} from 'lightning/messageService';
import CARS_FILTERED_LMS from '@salesforce/messageChannel/carsFiltered__c';

export default class CarFilter extends LightningElement {

    filters={
        searchKey:'',
        maxPrice:999999
    }
    categoryError=CATEGORY_ERROR
    makeError=MAKE_ERROR
    timer

    /* Load LMS context */
    @wire(MessageContext)
    messageContext

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
        //console.log('search key handler>>>', event.target.value)
        this.filters = {...this.filters, 'searchKey':event.target.value}
        this.sendDataToCarList()
    }

    /* price key handler*/
    handleMaxPriceChange(event){
        //console.log('price key handler>>>', event.target.value)
        this.filters = {...this.filters, 'maxPrice':event.target.value}
        this.sendDataToCarList()
    }

    handleCheckbox(event){
        if(!this.filters.categories){
            const categories = this.categories.data.values.map(item=>item.value)
            const makeType = this.makeType.data.values.map(item=>item.value)
            this.filters = {...this.filters, categories, makeType}
        }
        const {name, value} = event.target.dataset
        // console.log('name', name)
        // console.log('value', value)
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name] = [...this.filters[name], value]
            }
        }else{
            this.filters[name] = this.filters[name].filter(item=>item !== value)
        }
        this.sendDataToCarList()
    }

    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext, CARS_FILTERED_LMS, {
                filters:this.filters
            })
        },500)
    }
}