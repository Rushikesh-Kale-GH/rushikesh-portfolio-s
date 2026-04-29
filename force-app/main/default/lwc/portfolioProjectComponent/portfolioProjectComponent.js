import { LightningElement, api } from 'lwc';

export default class PortfolioProjectsComponent extends LightningElement {
    projects = [
        {
            id: 'proj1',
            title: 'POS 2.0 – UI Revamp & Solution Design',
            dateRange: 'March 2025 –  October 2025',
            description: 'Ui revamp , get chance to lead the team , design the scalable solution and fit in the existing',
            technologies: ['Team Lead', 'LWC', 'Custome CSS', 'Static Resource', 'Apex', 'Solution Design', 'Optimization'],
            isExpanded: false,
            isFeatured: true,
            details: [
                {
                    id: 'detail1_1',
                    text: 'Led the UI revamp initiative for POS 2.0, redesigning Lightning components for improved usability and performance.'
                },
                {
                    id: 'detail1_2',
                    text: 'Designed and implemented a scalable architecture aligned with existing system constraints and business workflows.'
                },
                {
                    id: 'detail1_3',
                    text: 'Collaborated with cross-functional teams to ensure seamless integration with legacy modules.'
                },
                {
                    id: 'detail1_4',
                    text: 'Improved component reusability and reduced technical debt through modular LWC design.'
                },
                {
                    id: 'detail1_5',
                    text: 'Design the Opportunity Parent LWC Component which work on SessionStorage and Parent Child Event Communication'
                },
                {
                    id: 'detail1_6',
                    text: 'Optimise the Apex code and change the Structure.'
                }
            ]
        },
        {
            id: 'proj2',
            title: 'NTB Loan POD – Platform Event Integration',
            dateRange: 'October 2025 – January 2026',
            description: 'platform event integration , design the solution which fit in the existing usecase',
            technologies: ['Platform Events', 'Apex REST', 'Named Credentials', 'LWC', 'Queueable', 'Custom Metadata', 'Custome Setting', 'Custome Object', 'Custome Label'],
            isExpanded: false,
            isFeatured: true,
            details: [
                {
                    id: 'detail2_1',
                    text: 'Designed and implemented Platform Event–based integration for NTB Loan POD to enable real-time communication between systems.'
                },
                {
                    id: 'detail2_2',
                    text: 'Handled error management, retry logic, and monitoring for reliable asynchronous processing.'
                },
                {
                    id: 'detail2_3',
                    text: 'Architected a scalable event-driven solution ensuring compatibility with existing business processes.'
                },
                {
                    id: 'detail2_4',
                    text: 'Improved system decoupling and reduced synchronous dependency failures.'
                }
            ]
        },
        {
            id: 'proj3',
            title: 'GitHub Migration – Azure to GitHub',
            dateRange: 'Sep 2024 – Nov 2024',
            description: 'azure to github migration , understanding the github, created the workflow, sfdc cli',
            technologies: ['Azure', 'GitHub', 'Git', 'Azure Devops', 'Azure Repos', 'GitHub WorkFlow', 'SFDC Cli'],
            isExpanded: false,
            isFeatured: false,
            details: [
                {
                    id: 'detail3_1',
                    text: 'Led migration from Azure DevOps to GitHub, establishing new CI/CD workflows for Salesforce deployments.'
                },
                {
                    id: 'detail3_2',
                    text: 'Designed and configured GitHub Actions workflows using Salesforce CLI for automated validation and deployment.'
                },
                {
                    id: 'detail3_3',
                    text: 'Implemented branching strategy and repository structure to support scalable DevOps practices.'
                },
                {
                    id: 'detail3_4',
                    text: 'Reduced manual deployment effort and improved release reliability.'
                }
            ]
        },
        {
            id: 'proj4',
            title: 'Personal Portfolio – LWC Community Site',
            dateRange: 'Jan 2026 – Feb 2026',
            description: 'lwc community site , personal project , use ai intensively for css, scalable structure developed using meta data , static resource and object',
            technologies: ['AI Tools', 'Design UI', 'Custom Metadata', 'Flow', 'LWC', 'CSS', 'Static Resource', 'Custome MetaData', 'Requirement Gathering', 'Content Version'],
            isExpanded: false,
            isFeatured: false,
            details: [
                {
                    id: 'detail4_1',
                    text: 'Developed a dynamic personal portfolio using LWC on Experience Cloud (Community Site).'
                },
                {
                    id: 'detail4_2',
                    text: 'Designed a scalable metadata-driven architecture leveraging Custom Metadata, Static Resources, and Custom Objects.'
                },
                {
                    id: 'detail4_3',
                    text: 'Utilized AI tools to optimize CSS styling, responsiveness, and UI animations.'
                },
                {
                    id: 'detail4_4',
                    text: 'Implemented reusable component structure for maintainability and performance optimization.'
                },
                {
                    id: 'detail4_5',
                    text: 'Custome Css and AI Tool Use'
                }
            ]
        }
    ];

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

    get projectsWithStyles() {
        return this.projects.map(project => ({
            ...project,
            cardClass: project.isFeatured
                ? 'project-card featured'
                : 'project-card standard',
            buttonLabel: project.isExpanded ? 'Hide Details' : 'Show Details'
        }));
    }

    handleToggleDetails(event) {
        this.scrollToElementHide(event);
        const projectId = event.currentTarget.dataset.id;
        this.projects = this.projects.map(project => {
            if (project.id === projectId) {
                return { ...project, isExpanded: !project.isExpanded };
            }
            return project;
        });
        this.dispatchCustomEvent('clicks','project');
    }

    scrollToElementHide(event) {
        const id = event.currentTarget.dataset.id;
        const element = this.template.querySelector(`[data-scroll-id="${id}"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
    }

    @api
    scrollToElement() {
        const element = this.template.querySelector(`[data-scroll-id="projects-section"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
    }
}