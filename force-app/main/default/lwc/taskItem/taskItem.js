import { LightningElement, api, track } from 'lwc';

export default class TaskItem extends LightningElement {
    @api taskId;
    @api taskName;
    @api type;      // 'Checkbox' | 'Toggle'
    @api status;    // Boolean

    get isCheckbox() { return this.type === 'Checkbox'; }
    get isToggle()   { return this.type === 'Toggle';   }

    get statusStr()  { return this.status ? 'true' : 'false'; }

    get itemClass() {
        return `task-item ${this.status ? 'completed' : ''}`;
    }

    get checkboxClass() {
        return `dt-checkbox ${this.status ? 'checked' : ''}`;
    }

    get labelClass() {
        return `task-label ${this.status ? 'done-label' : ''}`;
    }

    get toggleTrack() {
        return `toggle-track ${this.status ? 'active' : ''}`;
    }

    handleClick(event) {
        event.stopPropagation();
        const newStatus = !this.status;
        this.dispatchEvent(new CustomEvent('statuschange', {
            bubbles: true,
            composed: true,
            detail: {
                taskId: this.taskId,
                status: newStatus
            }
        }));
    }
}
