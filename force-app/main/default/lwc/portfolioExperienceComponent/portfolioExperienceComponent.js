import { LightningElement, api } from 'lwc';

export default class PortfolioExperienceComponent extends LightningElement {

    experiences = [
        {
            id: 'exp1',
            title: 'Senior Software Developer',
            company: 'BAJAJ FINSERV',
            location: 'Bengaluru, India',
            duration: 'Nov 2024 – Present',
            isCompanyChange: false,
            isOpen: false,
            responsibilities: [
                {
                    id: 'resp1_1',
                    label: 'Team Leadership',
                    text: [
                        { id: 'r1_1_1', point: 1, text: 'Leading POS 2.0 module with full technical ownership.' },
                        { id: 'r1_1_2', point: 2, text: 'Guiding developers on architecture, coding standards, and best practices.' },
                        { id: 'r1_1_3', point: 3, text: 'Reviewing design decisions and ensuring scalable implementation.' },
                        { id: 'r1_1_4', point: 4, text: 'Mentoring team members in Apex, LWC, and integrations.' },
                        { id: 'r1_1_5', point: 5, text: 'Coordinating with stakeholders to align technical solutions with business needs.' },
                        { id: 'r1_1_6', point: 6, text: 'Ensuring timely delivery with quality and performance focus.' }
                    ]
                },
                {
                    id: 'resp1_2',
                    label: 'DevOps & Optimization',
                    text: [
                        { id: 'r1_2_1', point: 1, text: 'Led migration from Azure DevOps to GitHub.' },
                        { id: 'r1_2_2', point: 2, text: 'Redesigned CI/CD pipelines for automated and reliable deployments.' },
                        { id: 'r1_2_3', point: 3, text: 'Improved branching strategy and release management process.' },
                        { id: 'r1_2_4', point: 4, text: 'Reduced deployment errors and improved system stability.' },
                        { id: 'r1_2_5', point: 5, text: 'Optimized existing code and reduced technical debt.' }
                    ]
                },
                {
                    id: 'resp1_3',
                    label: 'Integration & Architecture',
                    text: [
                        { id: 'r1_3_1', point: 1, text: 'Designed and implemented REST API integrations with external systems.' },
                        { id: 'r1_3_2', point: 2, text: 'Defined integration patterns and error handling strategies.' },
                        { id: 'r1_3_3', point: 3, text: 'Focused on modular and reusable system design.' },
                        { id: 'r1_3_4', point: 4, text: 'Improved system performance and scalability.' },
                        { id: 'r1_3_5', point: 5, text: 'Ensured secure data exchange and compliance with best practices.' }
                    ]
                },
                {
                    id: 'resp1_4',
                    label: 'Recognition',
                    text: [
                        { id: 'r1_4_1', point: 1, text: 'Received awards for innovation and delivery excellence.' },
                        { id: 'r1_4_2', point: 2, text: 'Recognized for strong ownership and leadership.' },
                        { id: 'r1_4_3', point: 3, text: 'Appreciated for solving complex technical challenges.' },
                        { id: 'r1_4_4', point: 4, text: 'Contributed to improved team productivity and system reliability.' }
                    ]
                }
            ]
        },
        {
            id: 'exp2',
            title: 'Software Developer',
            company: 'BAJAJ FINSERV',
            location: 'Bengaluru, India',
            duration: 'May 2023 - Oct 2024',
            isCompanyChange: false,
            isOpen: false,
            responsibilities: [
                {
                    id: 'resp2_1',
                    label: 'Module Ownership',
                    text: [
                        { id: 'r2_1_1', point: 1, text: 'Took end-to-end ownership of assigned Salesforce modules.' },
                        { id: 'r2_1_2', point: 2, text: 'Gathered and analyzed business requirements.' },
                        { id: 'r2_1_3', point: 3, text: 'Designed, developed, tested, and deployed solutions.' },
                        { id: 'r2_1_4', point: 4, text: 'Communicated directly with stakeholders for clarifications.' },
                        { id: 'r2_1_5', point: 5, text: 'Ensured on-time delivery with high quality standards.' }
                    ]
                },
                {
                    id: 'resp2_2',
                    label: 'Salesforce Development',
                    text: [
                        { id: 'r2_2_1', point: 1, text: 'Developed scalable solutions using Apex, LWC, and Flows.' },
                        { id: 'r2_2_2', point: 2, text: 'Implemented triggers, batch jobs, and asynchronous processes.' },
                        { id: 'r2_2_3', point: 3, text: 'Followed best practices for bulkification and security.' },
                        { id: 'r2_2_4', point: 4, text: 'Participated in code reviews to maintain quality.' },
                        { id: 'r2_2_5', point: 5, text: 'Handled bug fixes and production support efficiently.' }
                    ]
                },
                {
                    id: 'resp2_3',
                    label: 'Solution Design',
                    text: [
                        { id: 'r2_3_1', point: 1, text: 'Designed technical architecture for new features.' },
                        { id: 'r2_3_2', point: 2, text: 'Focused on reusable and maintainable components.' },
                        { id: 'r2_3_3', point: 3, text: 'Worked on API integrations and data modeling.' },
                        { id: 'r2_3_4', point: 4, text: 'Configured security model including roles and permissions.' },
                        { id: 'r2_3_5', point: 5, text: 'Optimized existing logic for better performance.' }
                    ]
                }
            ]
        },
        {
            id: 'exp3',
            title: 'Trainee Technology',
            company: 'BAJAJ FINSERV',
            location: 'Bengaluru, India',
            duration: 'Nov 2022 - Apr 2023',
            isCompanyChange: true,
            isOpen: false,
            responsibilities: [
                {
                    id: 'resp3_1',
                    label: 'Technical Foundation',
                    text: [
                        { id: 'r3_1_1', point: 1, text: 'Worked with React, Spring Boot, and SQL before Salesforce.' },
                        { id: 'r3_1_2', point: 2, text: 'Understood frontend-backend architecture and REST APIs.' },
                        { id: 'r3_1_3', point: 3, text: 'Learned database design and application structure.' },
                        { id: 'r3_1_4', point: 4, text: 'Built strong base in classical software development.' },
                        { id: 'r3_1_5', point: 5, text: 'Used this foundation to transition smoothly into Salesforce.' }
                    ]
                },
                {
                    id: 'resp3_2',
                    label: 'Salesforce Learning',
                    text: [
                        { id: 'r3_2_1', point: 1, text: 'Learned Apex, LWC, and Salesforce Flows.' },
                        { id: 'r3_2_2', point: 2, text: 'Understood governor limits and cloud architecture concepts.' },
                        { id: 'r3_2_3', point: 3, text: 'Built small features under senior guidance.' },
                        { id: 'r3_2_4', point: 4, text: 'Practiced declarative and programmatic development.' },
                        { id: 'r3_2_5', point: 5, text: 'Focused on platform best practices and standards.' }
                    ]
                },
                {
                    id: 'resp3_3',
                    label: 'Hands-on Projects',
                    text: [
                        { id: 'r3_3_1', point: 1, text: 'Worked on real Salesforce project enhancements.' },
                        { id: 'r3_3_2', point: 2, text: 'Implemented Flows, triggers, and basic Apex logic.' },
                        { id: 'r3_3_3', point: 3, text: 'Developed UI components using LWC.' },
                        { id: 'r3_3_4', point: 4, text: 'Learned Salesforce security model including Profiles, Roles, and Permission Sets.' },
                        { id: 'r3_3_5', point: 5, text: 'Used Salesforce CLI (SFDX) for development and deployments.' }
                    ]
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

    get experiencesWithStyles() {
        return this.experiences.map(exp => ({
            ...exp,
            cardClass: exp.isCompanyChange
                ? 'experience-card company-change'
                : 'experience-card promotion'
        }));
    }

    handleHideToggle(event) {
        this.scrollToElementHide(event);
        const selectedId = event.currentTarget.dataset.id;

        this.experiences = this.experiences.map(exp => {
            if (exp.id === selectedId) {
                return { ...exp, isOpen: false };
            }
            return exp;
        });
    }

    handleShowToggle(event) {
        this.scrollToElementHide(event);
        const selectedId = event.currentTarget.dataset.id;

        this.experiences = this.experiences.map(exp => {
            if (exp.id === selectedId) {
                return { ...exp, isOpen: true };
            }
            return exp;
        });
        this.dispatchCustomEvent('clicks','work');
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
        const element = this.template.querySelector(`[data-scroll-id="about-section"]`);
        const selectEvent = new CustomEvent('sectionchange', {
            detail: { status: element },
        });
        this.dispatchEvent(selectEvent);
    }
}