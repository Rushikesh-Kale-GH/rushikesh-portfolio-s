import { LightningElement, track, api } from 'lwc';
import THEME_1 from '@salesforce/resourceUrl/theme_1';
import THEME_2 from '@salesforce/resourceUrl/theme_2';
import THEME_3 from '@salesforce/resourceUrl/theme_3';

export default class PortfolioReactLearningComponent extends LightningElement {
    @track showAnimation = false;
    @track isAnimating = false;
    @track buttonLabel = 'Explore Portfolio';
    @track currentThemeIndex = 0;

    themeOne = THEME_1;
    themeTwo = THEME_2;
    themeThree = THEME_3;

    themes = [
        {
            name: 'Water Theme',
            background: this.themeOne,
            gradient: 'linear-gradient(135deg, rgba(30, 144, 255, 0.7) 0%, rgba(0, 191, 255, 0.6) 100%)',
            primaryColor: '#1E90FF',
            secondaryColor: '#00BFFF',
            glowColor: 'rgba(30, 144, 255, 0.6)',
            circleColor: 'linear-gradient(135deg, #1E90FF 0%, #00BFFF 100%)'
        },
        {
            name: 'Grass Theme',
            background: this.themeThree,
            gradient: 'linear-gradient(135deg, rgba(34, 139, 34, 0.7) 0%, rgba(144, 238, 144, 0.6) 100%)',
            primaryColor: '#228B22',
            secondaryColor: '#90EE90',
            glowColor: 'rgba(34, 139, 34, 0.6)',
            circleColor: 'linear-gradient(135deg, #228B22 0%, #90EE90 100%)'
        },
        {
            name: 'Fire Theme',
            background: this.themeTwo,
            gradient: 'linear-gradient(135deg, rgba(255, 69, 0, 0.7) 0%, rgba(255, 140, 0, 0.6) 100%)',
            primaryColor: '#FF4500',
            secondaryColor: '#FF8C00',
            glowColor: 'rgba(255, 69, 0, 0.6)',
            circleColor: 'linear-gradient(135deg, #FF4500 0%, #FF8C00 100%)'
        }
    ];

    connectedCallback() {
        this.initializeThemeFromStorage();
        this.handleAnimation();
    }

    initializeThemeFromStorage() {
        this.currentThemeIndex = sessionStorage.getItem('tCount');
    }

    getNextThemeIndex(currentIndex) {
        const nextIndex = currentIndex + 1;
        return nextIndex >= this.themes.length ? 0 : nextIndex;
    }

    get currentTheme() {
        return this.themes[this.currentThemeIndex].name;
    }

    get overlayClass() {
        return `fullpage-overlay theme-${this.currentThemeIndex}`;
    }

    get backgroundStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `background-image: url('${theme.background}');`;
    }

    get circleStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `background: ${theme.circleColor};`;
    }

    get collapseStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `background: ${theme.circleColor};`;
    }

    get glassStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `border: 2px solid ${theme.secondaryColor}40;`;
    }

    get badgeGlowStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `box-shadow: 0 0 60px ${theme.glowColor}, 0 0 100px ${theme.glowColor};`;
    }

    get badgePathStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `fill: ${theme.primaryColor};`;
    }

    get titleStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `color: ${theme.secondaryColor}; text-shadow: 0 0 20px ${theme.glowColor};`;
    }

    get dividerStyle() {
        const theme = this.themes[this.currentThemeIndex];
        return `background: linear-gradient(90deg, transparent, ${theme.secondaryColor}, transparent);`;
    }

    handleAnimation() {
        this.isAnimating = true;
        this.showAnimation = true;
        setTimeout(() => {
            this.showAnimation = false;
            this.isAnimating = false;
            this.buttonLabel = 'Explore Portfolio';
            this.currentThemeIndex = this.getNextThemeIndex(this.currentThemeIndex);
            this.dispatchEvent(new CustomEvent('animationend', {
                detail: { targetId: "test" },
            }));
        }, 2000);
    }
}