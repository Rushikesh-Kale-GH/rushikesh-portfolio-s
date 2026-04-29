import { LightningElement, track, api } from 'lwc';
import resumePDF from '@salesforce/resourceUrl/MyResume';
import coverLetterPDF from '@salesforce/resourceUrl/MyCoverLetter';

export default class PortfolioFooterComponent extends LightningElement {
    @track showResumeModal = false;
    @track showCoverLetterModal = false;

    get isHideButton() {
        return this.showResumeModal || this.showCoverLetterModal;
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

    resumeUrl = resumePDF;
    coverLetterUrl = coverLetterPDF;
    handleViewResume() {
        this.showResumeModal = true;
        this.scrollToElementFunction();
        this.dispatchCustomEvent('clicks','resumeView');
    }

    handleCloseResume() {
        this.showResumeModal = false;
        document.body.style.overflow = 'auto';
        this.scrollToElement();
    }

    handleViewCoverLetter() {
        this.showCoverLetterModal = true;
        this.scrollToElementFunction();
        this.dispatchCustomEvent('clicks','coverLetterView');
    }

    handleCloseCoverLetter() {
        this.showCoverLetterModal = false;
        document.body.style.overflow = 'auto';
        this.scrollToElement();
    }

    handleDownloadResume() {
        if (this.resumeUrl) {
            const link = document.createElement('a');
            link.href = this.resumeUrl;
            link.download = 'Rushikesh_Kale_Resume.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        this.dispatchCustomEvent('clicks','resumeDownload');
        }
    }

    handleDownloadCoverLetter() {
        if (this.coverLetterUrl) {
            const link = document.createElement('a');
            link.href = this.coverLetterUrl;
            link.download = 'Rushikesh_Kale_Cover_Letter.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.dispatchCustomEvent('clicks','coverLetterDownload');
        }
    }

    handleBackdropClick(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            if (this.showResumeModal) {
                this.handleCloseResume();
            }
            if (this.showCoverLetterModal) {
                this.handleCloseCoverLetter();
            }
        }
    }

    connectedCallback() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.body.style.overflow = 'auto';
    }

    handleKeyDown(event) {
        if (event.key === 'Escape') {
            if (this.showResumeModal) {
                this.handleCloseResume();
            }
            if (this.showCoverLetterModal) {
                this.handleCloseCoverLetter();
            }
        }
    }

    scrollToElementFunction() {
        console.log('there i am ')
        const element = this.template.querySelector(`[data-scroll-id="cover"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
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