import { LightningElement, api } from 'lwc';

export default class ProgressRing extends LightningElement {
    @api totalTasks     = 0;
    @api completedTasks = 0;

    get percentage() {
        if (!this.totalTasks || this.totalTasks === 0) return 0;
        return Math.round((this.completedTasks / this.totalTasks) * 100);
    }

    get ringColor() {
        const p = this.percentage;
        if (p >= 80) return '#34C759';   // Green
        if (p >= 50) return '#FF9F0A';   // Amber
        return '#FF453A';                 // Red
    }

    get dashArray()  { return (2 * Math.PI * 50).toFixed(2); }

    get dashOffset() {
        const circumference = 2 * Math.PI * 50;
        const progress = this.percentage / 100;
        return (circumference * (1 - progress)).toFixed(2);
    }

    get ariaLabel() {
        return `Progress: ${this.percentage}% complete`;
    }
}
