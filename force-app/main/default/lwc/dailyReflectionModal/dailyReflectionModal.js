import { LightningElement, api, track } from 'lwc';
import saveReflection from '@salesforce/apex/DailyTrackerController.saveReflection';

export default class DailyReflectionModal extends LightningElement {
    @api dayLogId;
    @api initialText = '';
    @track isOpen    = false;
    @track isSaving  = false;
    @track reflectionText = '';

    @api
    open() {
        this.reflectionText = this.initialText || '';
        this.isOpen = true;
    }

    handleInput(event) {
        this.reflectionText = event.target.value;
    }

    handleClose() {
        this.isOpen = false;
    }

    handleBackdropClick() {
        this.isOpen = false;
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    async handleSave() {
        this.isSaving = true;
        try {
            await saveReflection({
                dayLogId:       this.dayLogId,
                reflectionText: this.reflectionText
            });
            this.dispatchEvent(new CustomEvent('reflectionsaved', {
                detail: { text: this.reflectionText }
            }));
            this.isOpen = false;
        } catch (err) {
            console.error('Error saving reflection:', err);
        } finally {
            this.isSaving = false;
        }
    }
}
