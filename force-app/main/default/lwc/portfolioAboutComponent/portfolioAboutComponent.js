import { LightningElement, api, track } from 'lwc';
export default class PortfolioAboutComponent extends LightningElement {
    @api profileArtUrl;
    @track activeSkillCategory = 'salesforce';
    @api svgIconsList;

    skillCategoriesData = {
        salesforce: {
            title: 'Salesforce Core Development',
            color: 'blue',
            skills: [
                'Apex',
                'Apex Test Classes',
                'Asynchronous Apex [ Future - Queueable - Batchable - Schedulable ]',
                'Trigger Framework',
                'Visualforce',
                'Aura Framework',
                'Lightning Web Components (LWC)',
                'Flow Orchestration ( Flow, Process Builder, Workflows )',
                'Security ( OWD, Sharing Rules, Apex Sharing, Profiles, Permission Set )',
                'SOQL/SOSL',
                'Admin Basics'
            ]
        },
        integration: {
            title: 'Integration',
            color: 'purple',
            skills: [
                'REST/SOAP APIs',
                'Integration Patterns',
                'API Integration',
                'Continuation Callouts',
                'Platform Events',
                'OAuth 2.0',
                'Connected Apps',
                'Named Credentials',
                'Remote Site Settings',
                'Cors',
                'Content Secutity Policy(CSP)',
                'Salesforce Standard API'
            ]
        },
        devops: {
            title: 'DevOps & Tools',
            color: 'green',
            skills: [
                'GitHub',
                'Azure DevOps',
                'SFDX CLI',
                'CI/CD Pipelines',
                'Git',
                'Docker',
                'Kubernetes'
            ]
        },
        ai: {
            title: 'AI & Tools Tech',
            color: 'pink',
            skills: [
                'Salesforce DX',
                'VS Code',
                'GitHub Copilot',
                'ChatGPT',
                'Claude',
                'ML-DL-GENAI (Learning)'
            ]
        },
        programming: {
            title: 'Programming',
            color: 'orange',
            skills: ['Apex', 'LWC', 'Java Script', 'Java', 'C++', 'C']
        }
    };

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

    get skillCategories() {
        return Object.keys(this.skillCategoriesData).map(key => {
            const category = this.skillCategoriesData[key];
            const isActive = this.activeSkillCategory === key;
            return {
                key: key,
                title: category.title,
                color: category.color,
                buttonClass: isActive
                    ? `skill-button skill-button-${category.color} active`
                    : 'skill-button skill-button-inactive'
            };
        });
    }

    get activeSkillCategoryTitle() {
        return this.skillCategoriesData[this.activeSkillCategory].title;
    }

    get activeSkills() {
        return this.skillCategoriesData[this.activeSkillCategory].skills;
    }

    handleSkillCategoryClick(event) {
        this.activeSkillCategory = event.currentTarget.dataset.key;
        this.dispatchCustomEvent('clicks', 'skill');
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