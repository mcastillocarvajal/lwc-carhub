import { LightningElement,api } from 'lwc';

/* static resource */
import CAR_HUB_IMG from '@salesforce/resourceUrl/placeholder';

export default class Placeholder extends LightningElement {

    @api message

    placeholderUrl = CAR_HUB_IMG
}