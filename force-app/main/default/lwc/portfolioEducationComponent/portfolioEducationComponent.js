import { LightningElement, api } from 'lwc';
import getEducationDetails from '@salesforce/apex/PortfolioMainClass.getEducationDetails';

export default class PortfolioEducationComponent extends LightningElement {
    education = [];
    connectedCallback() {
        this.loadEducation();
    }

    loadEducation() {
        getEducationDetails()
            .then(result => {
                this.education = result;
            })
            .catch(error => {
                console.error('Error loading education:', error);
            });
    }

    get educationWithStyles() {
        return this.education.map(edu => ({
            ...edu,
            cardClass: edu.isPrimary
                ? 'education-card primary'
                : 'education-card secondary'
        }));
    }

    @api
    scrollToElement() {
        const element = this.template.querySelector(`[data-scroll-id="education-section"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
    }
}