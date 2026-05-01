import { LightningElement, track, wire } from 'lwc';
import getWeeklyStats         from '@salesforce/apex/AnalyticsController.getWeeklyStats';
import getCategoryDistribution from '@salesforce/apex/AnalyticsController.getCategoryDistribution';
import getStreak               from '@salesforce/apex/AnalyticsController.getStreak';

const DAYS      = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const CAT_EMOJI = { Health: '💚', Career: '💼', Discipline: '⚡' };
const CAT_COLOR = { Health: '#34C759', Career: '#0A84FF', Discipline: '#FF9F0A' };

export default class AnalyticsDashboard extends LightningElement {
    @track weeklyStats    = [];
    @track categoryStats  = [];
    @track streak         = 0;
    @track isLoading      = true;

    connectedCallback() { this.loadData(); }

    async loadData() {
        this.isLoading = true;
        try {
            const [weekly, category, streak] = await Promise.all([
                getWeeklyStats(),
                getCategoryDistribution(),
                getStreak()
            ]);

            this.streak = streak || 0;

            this.weeklyStats = (weekly || []).map(d => {
                const dateObj = new Date(d.logDate);
                const score   = Math.round(d.score || 0);
                let color = score >= 80 ? '#34C759' : score >= 50 ? '#FF9F0A' : '#FF453A';
                return {
                    ...d,
                    score,
                    dayLabel: DAYS[dateObj.getUTCDay()],
                    barStyle: `height:${Math.max(score, 4)}%;background:${color};`
                };
            });

            this.categoryStats = (category || []).map(c => ({
                ...c,
                emoji:    CAT_EMOJI[c.category] || '📊',
                barStyle: `width:${c.percentage}%;background:${CAT_COLOR[c.category] || '#888'};`
            }));

        } catch (err) {
            console.error('Analytics load error:', err);
        } finally {
            this.isLoading = false;
        }
    }
}
