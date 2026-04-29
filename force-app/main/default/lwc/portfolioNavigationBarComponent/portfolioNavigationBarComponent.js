import { LightningElement, track, api } from 'lwc';
import INTRO_JS from '@salesforce/resourceUrl/introjs';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import getIconsByContext from '@salesforce/apex/PortfolioMainClass.getIconsByContext';
import getRushikeshMdtInfo from '@salesforce/apex/PortfolioMainClass.getRushikeshMdtInfo';

export default class PortfolioNavigationBarComponent extends LightningElement {

    @api profileUrl;
    dataLoaded = false;

    navigationIcon;
    svgIconsList;
    menuLogoIcon;
    verifiedIcon;
    menuIcon;
    backIcon;

    metadataInfo;
    nameUpperCase;

    introLoaded = false;

    @track isMenuOpen = false;
    @track isVisible = false;
    @track isOpen = false;

    connectedCallback() {
        this.getIconsByContext();
        this.getRushikeshMdtInfo();
    }

    getRushikeshMdtInfo() {
        getRushikeshMdtInfo({}).then(data => {
            this.metadataInfo = data;
            this.nameUpperCase = data.Name__c.toUpperCase();
            this.dataLoaded = true;
        }).catch(error => {
            console.log('Error in PortfolioNavigationBarComponent @connectedCallback-getRushikeshMdtInfo: ' + JSON.stringify(error));
        });
    }

    getIconsByContext() {
        getIconsByContext({}).then(data => {
            this.navigationIcon = data.Navigation;
            this.menuIcon = data.Menu;
            this.menuLogoIcon = data.Generic[0].Id;
            this.verifiedIcon = data.Generic[1].Id;
            this.backIcon = data.Generic[2].Id;
            this.svgIconsList = [...data.Navigation, ...data.Menu, ...data.Generic];
        }).catch(error => {
            console.log('Error in PortfolioNavigationBarComponent @connectedCallback-getIconsByContext: ' + JSON.stringify(error));
        });
    }

    renderedCallback() {
        try {

            if (this.svgIconsList && this.svgIconsList.length > 0) {
                this.svgIconsList.forEach(icon => {
                    const containers = this.template.querySelectorAll(`[data-id="${icon.Id}"]`);
                    containers.forEach(container => {
                        if (container && !container.hasChildNodes()) {
                            container.innerHTML = icon.SVG_Code__c;
                        }
                    });
                });
            }
        } catch (error) {
            console.log('Error in PortfolioNavigationBarComponent @renderedCallback-iconLoaded: ' + JSON.stringify(error));
        }

        if (this.introLoaded) return;

        Promise.all([
            loadScript(this, INTRO_JS + '/introjs/intro.min.js'),
            loadStyle(this, INTRO_JS + '/introjs/introjs.min.css')
        ]).then(() => {
            this.introLoaded = true;
            this.handleStartTour();
        }).catch(error => {
            console.log('Error in PortfolioNavigationBarComponent @renderedCallback-introLoaded: ' + JSON.stringify(error));
        });
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

    handleStartTour() {
        this.dispatchEvent(new CustomEvent('menuclick', {
            detail: { targetId: 'About Me' },
        }));
        if (this.introLoaded) {
            const intro = window.introJs();
            intro.setOptions({
                helperLayerTarget: this.template.host,
                scrollToElement: false,
                showProgress: true,
                showBullets: true,
                steps: [
                    {
                        element: this.template.querySelector('.one'),
                        intro: `
                        <div style="text-align: center;">
                            <strong style="display: block; font-size: 1.3rem; margin-bottom: 8px;">
                                Welcome! Let’s Get Started ✨
                            </strong>
                            <div style="font-weight: 500; display: block; line-height: 1.4;">
                                Thanks for visiting my portfolio.
                            </div>
                            <div style="font-weight: 500; display: block; line-height: 1.4;">
                                Click on my name to trigger the walkthrough again and navigate through my work and experience with ease.
                            </div>
                        </div>
                        `
                    },
                    {
                        element: this.template.querySelector('.themeC'),
                        intro: `
                        <div style="text-align: center;">
                            <strong style="display: block; font-size: 1.3rem; margin-bottom: 8px;">
                                🎨 Theme Customization
                            </strong>
                            <div style="font-weight: 500; display: block; line-height: 1.4;">
                            🌊 Water - 🌿 Grass - 🔥 Fire
                            </div>
                            <div style="font-weight: 500; display: block; line-height: 1.4;">
                                Switch between themes to personalize your viewing experience. 
                            </div>
                        </div>
                        `
                    },
                    {
                        element: this.template.querySelector('.two'),
                        intro: `
                        <div style="text-align: center;">
                            <strong style="display: block; font-size: 1.3rem; margin-bottom: 8px;">
                                Find What You Need 🎯
                            </strong>
                            <span style="font-weight: 500; display: block; line-height: 1.4;">
                                Use this menu to navigate through my experience, technical skills, and featured projects effortlessly.
                            </span>
                        </div>
                        `
                    },
                    {
                        element: this.template.querySelector('.three'),
                        intro: `
                        <div style="text-align: center;">
                            <strong style="display: block; font-size: 1.3rem; margin-bottom: 8px;">
                                Get in Touch 📩
                            </strong>
                            <span style="font-weight: 500; display: block; line-height: 1.4;">
                                Click on my profile pic to view my profile card. Open my profile card to find my email and LinkedIn details for professional collaboration.
                            </span>
                        </div>
                        `
                    },
                    {
                        element: this.template.querySelector('.four'),
                        intro: `
                        <div style="text-align: center;">
                            <strong style="display: block; font-size: 1.3rem; margin-bottom: 8px;">
                                🚀 Explore My Journey 📚
                            </strong>
                            <span style="font-weight: 500; display: block; line-height: 1.4;">
                                This menu gives you access to my learning path, academic background, project work, and recognitions. Explore each section to know more about my journey.
                            </span>
                        </div>
                        `
                    }
                ]
            });
            if (sessionStorage.getItem('tour_already_seen') != 'true') {
                setTimeout(() => { intro.start(); }, 1500);
            }
            sessionStorage.setItem('tour_already_seen', 'true');
        }
    }

    get navigationClass() {
        return (this.isMenuOpen || this.isVisible) ? 'navbar' : 'navbar active';
    }

    get cardClass() {
        return this.isVisible ? 'profile-card show' : 'profile-card';
    }

    get menuClassH() {
        return this.isMenuOpen ? 'nav-links active' : 'two nav-links';
    }

    get menuClassF() {
        return this.isOpen ? 'menu-panel active' : 'menu-panel';
    }

    get buttonClass() {
        return this.isOpen ? 'fab-button active' : 'fab-button';
    }

    togglePopup() {
        this.isVisible = !this.isVisible;
        this.dispatchCustomEvent('clicks','profile');
    }

    toggleMenuFloat() {
        this.isOpen = !this.isOpen;
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    showWalkThrought() {
        sessionStorage.setItem('tour_already_seen', 'false');
        this.handleStartTour();
        this.dispatchCustomEvent('engagement','walkthrough');
    }

    handleClick(event) {
        this.isMenuOpen = false;
        const target = event.currentTarget.dataset.target;
        this.dispatchEvent(new CustomEvent('navclick', {
            detail: { targetId: target },
        }));
    }

    handleMenuClick(event) {
        const name = event.currentTarget.dataset.name;
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('menuclick', {
            detail: { targetId: name },
        }));
        this.dispatchCustomEvent('clicks','menu');
    }

    changeTheme(event) {
        const target = event.currentTarget.dataset.target;
        this.dispatchEvent(new CustomEvent('themeclick', {
            detail: { targetId: target },
        }));
    }

    disconnectedCallback() {
        document.body.style.overflow = 'auto';
    }
}