import { LightningElement, track } from 'lwc';
import PROFILE_PIC from '@salesforce/resourceUrl/Profile';
import THEME_1 from '@salesforce/resourceUrl/theme_1';
import THEME_2 from '@salesforce/resourceUrl/theme_2';
import THEME_3 from '@salesforce/resourceUrl/theme_3';
import getOrRegisterIP from '@salesforce/apex/PortfolioMainClass.getOrRegisterIP';
import updateVisitorTracking from '@salesforce/apex/PortfolioMainClass.updateVisitorTracking';

export default class PortfolioMainComponent extends LightningElement {

    storageKey = "portfolio_session_metrics";
    defaultSessionMetrics = {
        engagement: {
            timeSpent: 0,
            refresh: 0,
            walkthrough: 0,
            themeChange: 0
        },

        clicks: {
            menu: 0,
            profile: 0,
            bubble: 0,
            skill: 0,
            work: 0,
            project: 0,
            certificate: 0,
            rnr: 0,
            resumeView: 0,
            coverLetterView: 0,
            resumeDownload: 0,
            coverLetterDownload: 0
        },

        nav: {
            about: 0,
            work: 0,
            project: 0,
            cert: 0,
            contact: 0,
            downloadResume: 0,
            viewResume: 0,
            education: 0,
            rnr: 0,
            email: 0,
            linkedIn: 0,
            github: 0,
            learning: 0,
            trailhead: 0
        }
    };
    navEvent;
    themeOne = THEME_1;
    profileUrl = PROFILE_PIC;
    profileArtUrl = PROFILE_PIC;
    isAnimation = false;
    detectedIp;

    connectedCallback() {
        this.startAutoSync();
        if (sessionStorage.getItem('tCount') == null) {
            sessionStorage.setItem('tCount', '0');
            this.themeOne = THEME_1;
        } else {
            if (sessionStorage.getItem('tCount') == '0') {
                this.themeOne = THEME_1;
            }
            if (sessionStorage.getItem('tCount') == '1') {
                this.themeOne = THEME_2;
            }
            if (sessionStorage.getItem('tCount') == '2') {

                this.themeOne = THEME_3;
            }
        }
        this.removeClasses();
        try {
            if (!sessionStorage.getItem('ipId')) {
                this.handleIPProcess();
            }
            if (!sessionStorage.getItem(this.storageKey)) {
                sessionStorage.setItem(
                    this.storageKey,
                    JSON.stringify(this.defaultSessionMetrics)
                );
            } else {
                this.incrementMetric('engagement', 'refresh');
            }
        } catch (error) {
            console.log('RemoveAttribute Error : ' + error);
        }
    }

    incrementChildMetric(event) {
        let param1 = event.detail.param1;
        let param2 = event.detail.param2;
        this.incrementMetric(param1, param2);
    }

    incrementMetric(section, field) {
        const data = JSON.parse(sessionStorage.getItem(this.storageKey));
        if (data[section] && data[section][field] !== undefined) {
            data[section][field] += 1;
            sessionStorage.setItem(this.storageKey, JSON.stringify(data));
        }
    }

    startAutoSync() {
        this.intervalId = setInterval(() => {
            this.incrementMetric('engagement', 'timeSpent');
            this.syncToSalesforce();
        }, 30000);
    }

    async syncToSalesforce() {
        try {
            const trackingJson = sessionStorage.getItem(this.storageKey);
            const recordId = sessionStorage.getItem('ipId');
            if (!trackingJson) {
                console.warn('No tracking data found in session storage.');
                return;
            }
            if (!recordId) {
                console.warn('No recordId found in session storage.');
                return;
            }
            let parsed;
            try {
                parsed = JSON.parse(trackingJson);
            } catch (jsonError) {
                console.error('Invalid JSON in session storage.', jsonError);
                return;
            }
            if (!parsed || Object.keys(parsed).length === 0) {
                console.warn('Tracking data is empty.');
                return;
            }
            await updateVisitorTracking({
                recordId: recordId,
                trackingJson: trackingJson
            });
        } catch (error) {
            if (error?.body?.message) {
                console.error('Apex Error:', error.body.message);
            } else {
                console.error('Unknown Error:', error);
            }
        }
    }

    async handleIPProcess() {
        try {
            const updateData = await getOrRegisterIP();
            sessionStorage.setItem('ipId', updateData.recordId);
            sessionStorage.setItem('viewCount', updateData.countValue);
        } catch (error) {
            console.error('Apex Error:', error);
        } finally {
            this.isLoading = false;
        }
    }

    removeClasses() {
        try {
            document.querySelectorAll('div').forEach(element => {
                if (element.classList[0] == "cCenterPanel" || element.classList[0] == "slds-col--padded") {
                    element.removeAttribute('class');
                }
            });
        } catch (error) {
            console.log('RemoveAttribute Error : ' + error);
        }
    }

    handleNavClick(event) {
        const element = event.detail.targetId;
        this.navEvent = element;
        const childCmp = this.template.querySelector('c-portfolio-body-component');
        childCmp.handleScrollClick(element);
    }

    handleMenuClick(event) {
        const element = event.detail.targetId;
        this.navEvent = element;
        const childCmp = this.template.querySelector('c-portfolio-body-component');
        childCmp.handleScrollClick(element);

    }

    handleThemeClick() {
        this.incrementMetric('engagement', 'themeChange');
        sessionStorage.setItem('tCount', ((Number(sessionStorage.getItem('tCount')) + 1) % 3));
        this.isAnimation = true;
        if (sessionStorage.getItem('tCount') == '0') {
            this.themeOne = THEME_1;
        }
        if (sessionStorage.getItem('tCount') == '1') {
            this.themeOne = THEME_2;
        }
        if (sessionStorage.getItem('tCount') == '2') {
            this.themeOne = THEME_3;
        }
    }

    handleLearningClick() {
        this.isAnimation = true;
    }

    handleAnimationEnd() {
        this.isAnimation = false;
    }
}