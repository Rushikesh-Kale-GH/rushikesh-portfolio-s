import { LightningElement, track, api } from 'lwc';
import getCertificateDetails from '@salesforce/apex/PortfolioMainClass.getCertificateDetails';

export default class PortfolioViewCertificateComponent extends LightningElement {

    @track isModalOpen = false;
    @track selectedImageUrl = '';
    @track certifications;

    connectedCallback() {
        getCertificateDetails({}).then(data => {
            this.certifications = data;
        }).catch(error => {
            console.log('error : ' + JSON.stringify(error));
        })
    }

    handleImageClick(event) {
        this.selectedImageUrl = event.currentTarget.dataset.url;
        this.isModalOpen = true;
        this.scrollToElement();
        this.dispatchCustomEvent('clicks','certificate');
    }

    closeModal() {
        this.isModalOpen = false;
    }

    stopProp(event) {
        event.stopPropagation();
    }

    toggleModal() {
        this.isModalOpen = !this.isModalOpen;
    }

    dispatchCustomEvent(param1, param2) {
        this.dispatchEvent(
            new CustomEvent('updatejson', {
                detail: {
                    param1: param1,
                    param2: param2
                }
            })
        );
    }

    handleViewCertificate(event) {
        const certificateUrl = event.currentTarget.dataset.url;
        if (certificateUrl) {
            window.open(certificateUrl, '_blank', 'noopener,noreferrer');
        }
    }

    handleImageError(event) {
        event.target.src = 'https://via.placeholder.com/200/6366f1/ffffff?text=Certificate';
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