import { LightningElement, track } from 'lwc';
import getOrCreateTodayLog from '@salesforce/apex/DailyTrackerController.getOrCreateTodayLog';
import getTodayTasks        from '@salesforce/apex/DailyTrackerController.getTodayTasks';
import saveTaskStatus       from '@salesforce/apex/DailyTrackerController.saveTaskStatus';
import calculateScore       from '@salesforce/apex/DailyTrackerController.calculateScore';

const MOTIVATION = [
    'Make today count.', 'Build the habit.', 'One step at a time.',
    'Focus. Execute. Win.', 'Small wins compound.', 'Stay consistent.',
    'Progress, not perfection.', 'Show up. Every day.'
];

const DAYS_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default class DailyTrackerDashboard extends LightningElement {
    @track dayLog         = { Total_Tasks__c: 0, Completed_Tasks__c: 0, Score__c: 0,
                               Health_Score__c: 0, Career_Score__c: 0, Discipline_Score__c: 0,
                               Reflection__c: '' };
    @track allTasks       = [];
    @track isLoading      = true;
    @track showAnalytics  = false;
    @track showToast      = false;
    @track toastMessage   = '';
    @track toastType      = 'success';  // success | error

    dayLogId = null;

    // ─── Lifecycle ─────────────────────────────
    connectedCallback() { this.initDashboard(); }

    async initDashboard() {
        this.isLoading = true;
        try {
            const log = await getOrCreateTodayLog();
            this.dayLogId = log.Id;
            this.dayLog   = { ...log };
            await this.refreshTasks();
        } catch (err) {
            console.error('Init error:', err);
            this.showNotification('Failed to load tracker', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async refreshTasks() {
        const tasks = await getTodayTasks({ dayLogId: this.dayLogId });
        this.allTasks = tasks || [];
    }

    // ─── Computed ──────────────────────────────
    get todayDateLabel() {
        const d = new Date();
        return `${DAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
    }

    get motivationText() {
        const idx = new Date().getDay() % MOTIVATION.length;
        return MOTIVATION[idx];
    }

    get healthTasks()     { return this.allTasks.filter(t => t.category === 'Health');     }
    get careerTasks()     { return this.allTasks.filter(t => t.category === 'Career');     }
    get disciplineTasks() { return this.allTasks.filter(t => t.category === 'Discipline'); }

    get noHealthTasks()     { return this.healthTasks.length === 0;     }
    get noCareerTasks()     { return this.careerTasks.length === 0;     }
    get noDisciplineTasks() { return this.disciplineTasks.length === 0; }

    get healthProgress()     { return this._catProg(this.healthTasks);     }
    get careerProgress()     { return this._catProg(this.careerTasks);     }
    get disciplineProgress() { return this._catProg(this.disciplineTasks); }

    _catProg(tasks) {
        if (!tasks.length) return '0 / 0';
        const done = tasks.filter(t => t.status).length;
        return `${done} / ${tasks.length}`;
    }

    get toastClass() {
        return `toast-msg ${this.toastType === 'error' ? 'toast-error' : 'toast-success'}`;
    }

    // ─── Task Status Change ─────────────────────
    async handleStatusChange(event) {
        const { taskId, status } = event.detail;

        // Optimistic UI update
        this.allTasks = this.allTasks.map(t =>
            t.taskId === taskId ? { ...t, status } : t
        );

        try {
            await saveTaskStatus({
                dayLogId: this.dayLogId,
                taskId,
                status
            });
            const updatedLog = await calculateScore({ dayLogId: this.dayLogId });
            this.dayLog = { ...updatedLog };
            this.showNotification(status ? '✓ Task completed' : 'Task marked incomplete', 'success');
        } catch (err) {
            console.error('Save error:', err);
            // Revert optimistic update
            this.allTasks = this.allTasks.map(t =>
                t.taskId === taskId ? { ...t, status: !status } : t
            );
            this.showNotification('Failed to save', 'error');
        }
    }

    // ─── Reflection ────────────────────────────
    openReflection() {
        this.template.querySelector('c-daily-reflection-modal').open();
    }

    handleReflectionSaved(event) {
        this.dayLog = { ...this.dayLog, Reflection__c: event.detail.text };
        this.showNotification('Reflection saved ✓', 'success');
    }

    // ─── Analytics Toggle ──────────────────────
    toggleAnalytics() {
        this.showAnalytics = !this.showAnalytics;
    }

    // ─── Toast ─────────────────────────────────
    showNotification(message, type = 'success') {
        this.toastMessage = message;
        this.toastType    = type;
        this.showToast    = true;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => { this.showToast = false; }, 2500);
    }
}
