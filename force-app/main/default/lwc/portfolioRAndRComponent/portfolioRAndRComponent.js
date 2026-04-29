import { LightningElement, api } from 'lwc';
import getRewardAndRecognation from '@salesforce/apex/PortfolioMainClass.getRewardAndRecognation';

export default class PortfolioRAndRComponent extends LightningElement {
    rewards = [];
    currentIndex = 0;
    touchStartX = 0;
    touchEndX = 0;
    autoPlayInterval;
    autoPlayDelay = 5000;

    connectedCallback() {
        this.loadEducation();
    }

    disconnectedCallback() {
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

    loadEducation() {
        getRewardAndRecognation()
            .then(result => {
                this.education = result;
                this.rewards = this.formatCertifications(this.education);
                if (this.rewards.length > 0) {
                }
            })
            .catch(error => {
                console.error('Error loading education:', error);
            });
    }

    formatCertifications(inputArray) {
        return inputArray.map((item, index) => {
            const highlightArray = item.grade
                ? item.grade.split(';').map((text, i) => ({
                    id: `highlight_${index}_${i}`,
                    text: text.trim()
                }))
                : [];
            return {
                id: `reward_${index}`,
                title: item.degree,
                organization: item.institution,
                date: item.duration,
                description: item.description,
                imageUrl: item.imageUrl,
                imagePosition: index % 2 === 0 ? 'left' : 'right',
                category: item.category || 'Achievement',
                highlights: highlightArray
            };
        });
    }

    get currentReward() {
        if (this.rewards.length === 0) return null;
        const reward = this.rewards[this.currentIndex];
        return {
            ...reward,
            containerClass: reward.imagePosition === 'left'
                ? 'reward-item image-left active'
                : 'reward-item image-right active',
            categoryBadgeClass: reward.category === 'Certification'
                ? 'category-badge certification'
                : 'category-badge achievement'
        };
    }

    get isPrevDisabled() {
        return this.currentIndex === 0;
    }

    get isNextDisabled() {
        return this.currentIndex === this.rewards.length - 1;
    }

    get showNavigation() {
        return this.rewards.length > 1;
    }

    get currentSlideNumber() {
        return this.currentIndex + 1;
    }

    get totalSlides() {
        return this.rewards.length;
    }

    get progressPercentage() {
        if (this.rewards.length === 0) return 0;
        return ((this.currentIndex + 1) / this.rewards.length) * 100;
    }

    get progressBarStyle() {
        return `width: ${this.progressPercentage}%`;
    }

    handleIndicatorClick(event) {
        const index = parseInt(event.currentTarget.dataset.index, 10);
        this.navigateToSlide(index);
    }

    get rewardsWithIndicators() {
        return this.rewards.map((reward, index) => ({
            ...reward,
            isActive: index === this.currentIndex,
            index: index
        }));
    }

    handlePrevious() {
        if (!this.isPrevDisabled) {
            this.navigateToSlide(this.currentIndex - 1);
            this.scrollToElementNextPrev();
        }
    }

    handleNext() {
        if (!this.isNextDisabled) {
            this.navigateToSlide(this.currentIndex + 1);
            this.scrollToElementNextPrev();
        }
        this.dispatchCustomEvent('clicks','rnr');
    }

    navigateToSlide(index) {
        const slider = this.template.querySelector('.rewards-slider');
        if (slider) {
            slider.classList.add('sliding');
            setTimeout(() => {
                this.currentIndex = index;
                slider.classList.remove('sliding');
            }, 300);
        } else {
            this.currentIndex = index;
        }
         this.dispatchCustomEvent('clicks','rnr');
    }

    handleTouchStart(event) {
        this.touchStartX = event.changedTouches[0].screenX;
    }

    handleTouchEnd(event) {
        this.touchEndX = event.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && !this.isNextDisabled) {
                this.navigateToSlide(this.currentIndex + 1);
            } else if (diff < 0 && !this.isPrevDisabled) {
                this.navigateToSlide(this.currentIndex - 1);
            }
        }
    }

    startAutoPlay() {
        if (this.rewards.length > 1) {
            this.autoPlayInterval = setInterval(() => {
                if (this.isNextDisabled) {
                    this.navigateToSlide(0);
                } else {
                    this.navigateToSlide(this.currentIndex + 1);
                }
            }, this.autoPlayDelay);
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    scrollToElementNextPrev() {
        const element = this.template.querySelector(`[data-scroll-id="reset"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
    }

    @api
    scrollToElement() {
        const element = this.template.querySelector(`[data-scroll-id="rewards-section"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
    }
}