import { LightningElement, track, api } from 'lwc';
import createUserContact from '@salesforce/apex/PortfolioMainClass.createUserContact';
import getLiveViewCount from '@salesforce/apex/PortfolioMainClass.getLiveViewCount';

export default class PortfolioContactMeComponent extends LightningElement {
    @track formData = {
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: ''
    };

    @track isSubmitting = false;
    @track showSuccess = false;
    @track showError = false;
    @track errorMessage = '';
    count;

    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.value;
        this.formData = { ...this.formData, [field]: value };
    }

    connectedCallback() {
        getLiveViewCount({}).then(data=>{
             this.count = data;
        }).catch(error=>{
            console.log('>>> error : '+error);
        });
    }

    validateForm() {
        const { name, email, subject, message } = this.formData;
        if (!name || !email || !subject || !message) {
            this.errorMessage = 'Please fill in all required fields.';
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.errorMessage = 'Please enter a valid email address.';
            return false;
        }
        if (name.trim().length < 2) {
            this.errorMessage = 'Name must be at least 2 characters long.';
            return false;
        }
        if (message.trim().length < 10) {
            this.errorMessage = 'Message must be at least 10 characters long.';
            return false;
        }
        return true;
    }

    handleSubmit(event) {
        this.scrollToElement();
        event.preventDefault();
        this.showSuccess = false;
        this.showError = false;
        this.errorMessage = '';

        if (!this.validateForm()) {
            this.showError = true;
            return;
        }

        this.isSubmitting = true;
        this.simulateSubmission();
    }

    simulateSubmission() {
        const sessionId = sessionStorage.getItem('ipId');
        createUserContact({
            lwcId: sessionId,
            jsonString: JSON.stringify(this.formData)
        }).then((result) => {
            this.handleSuccess();
        }).catch((error) => {
            this.handleError(error)
        }).finally(() => {
            this.isLoading = false;
        });
    }

    handleSuccess() {
        this.isSubmitting = false;
        this.showSuccess = true;
        this.showError = false;

        this.formData = {
            name: '',
            email: '',
            company: '',
            phone: '',
            subject: '',
            message: ''
        };

        setTimeout(() => {
            this.showSuccess = false;
        }, 5000);
    }

    handleError(error) {
        this.isSubmitting = false;
        this.showError = true;
        this.showSuccess = false;
        this.errorMessage = error.body?.message || 'An error occurred while sending your message. Please try again.';
        setTimeout(() => {
            this.showError = false;
        }, 5000);
    }

    getFormData() {
        return this.formData;
    }

    @api
    scrollToElement() {
        const element = this.template.querySelector(`[data-scroll-id="about-section"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
    }
}