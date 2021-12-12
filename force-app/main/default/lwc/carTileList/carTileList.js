import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars';

/* lms */
import {publish,subscribe,MessageContext,unsubscribe} from 'lightning/messageService';
import CARS_FILTERED_LMS from '@salesforce/messageChannel/carsFiltered__c';
import CAR_SELECTED_LMS from '@salesforce/messageChannel/carSelected__c';

export default class CarTileList extends LightningElement {

    cars=[]
    error
    filters = {}
    carFilterSubscription
    
    @wire(getCars, {filters: '$filters'})
    carsHandler({data,error}){
        if(data){
            //console.log(data)
            this.cars = data
        }
        if(error){
            this.error = error
            console.error(error)
        }
    }

    /* Load LMS context */
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext, CARS_FILTERED_LMS, (message)=>this.handleFilterChanges(message))
    }

    handleFilterChanges(message){
        //console.log(message.filters)
        this.filters = {...message.filters}
    }

    handleCarSelected(event){
        publish(this.messageContext, CAR_SELECTED_LMS, {
            carId:event.detail
        })
    }

    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }
}