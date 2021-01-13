import './scss/index.scss';

const EDGE_WIDTH = 4;

type Dimensions = {
    fromLeft: number;
    fromRight: number;
    sliderWidth: number;
};

const positionConstraints = [
    (dim: Dimensions) => dim.fromLeft > 0,
    (dim: Dimensions) => dim.fromRight > 0,
];

export class ChartMap {
    private slider: HTMLDivElement;
    private left: HTMLDivElement;
    private viewport: HTMLDivElement;
    private right: HTMLDivElement;
    private sliderRect: DOMRect;
    private viewportRect: DOMRect;
    private dimensions: Dimensions = {
        fromLeft: 100,
        fromRight: 600,
        sliderWidth: 900,
    };
    constructor() {
        this.slider = document.querySelector('.slider') as HTMLDivElement;
        this.left = document.querySelector('.viewport-left-edge') as HTMLDivElement;
        this.viewport = document.querySelector('.viewport') as HTMLDivElement;
        this.right = document.querySelector('.viewport-left-edge') as HTMLDivElement;
        this.sliderRect = this.slider.getBoundingClientRect();
        this.viewportRect = this.viewport.getBoundingClientRect();

        this.setPosition();
        this.handleDrag();
        this.handleResize();
        this.setupCSSVars();
    }

    private handleDrag() {
        this.viewport.addEventListener('mousedown', (event) => {
            event.preventDefault();
            let startX = event.pageX;

            const onMousemove = (e: MouseEvent) => {
                const delta = startX - e.pageX;
                this.calculateDrag(delta);
                this.setPosition();
                startX = e.pageX;
            };

            this.addEventListeners(onMousemove);
        });
    }

    private handleResize() {
        this.left.addEventListener('mousedown', (event) => {
            event.preventDefault();
            event.stopPropagation();
            let startX = event.pageX;

            const onMousemove = (e: MouseEvent) => {
                const delta = startX - e.pageX;
                this.calculateResize(delta);
                this.setPosition();

                startX = e.pageX;
            };

            this.addEventListeners(onMousemove);
        });
    }

    private setDimensions(dim: Partial<Dimensions>) {
        this.dimensions = {
            ...this.dimensions,
            ...dim,
        };
    }

    private setPosition() {
        this.viewport.style.left = `${this.dimensions.fromLeft}px`;
        this.viewport.style.right = `${this.dimensions.fromRight}px`;
    }

    private calculateDrag(delta: number) {
        const sliderRect = this.slider.getBoundingClientRect();
        const viewportRect = this.viewport.getBoundingClientRect();
        const sliderWidth = sliderRect.width;

        let fromLeft = viewportRect.left - sliderRect.left - delta;
        let fromRight = sliderRect.right - viewportRect.right + delta;
        if (fromLeft < 0) {
            fromLeft = 0;
            fromRight = sliderWidth - viewportRect.width;
        }
        if (fromRight < 0) {
            fromRight = 0;
            fromLeft = sliderWidth - viewportRect.width;
        }
        this.setDimensions({ fromLeft, fromRight });
    }

    private calculateResize(delta: number) {
        const sliderRect = this.slider.getBoundingClientRect();
        const viewportRect = this.viewport.getBoundingClientRect();

        const fromLeft = viewportRect.left - sliderRect.left - delta;
        this.setDimensions({ fromLeft });
    }

    private setupCSSVars() {
        document.documentElement.style.setProperty('--edge-width', `${EDGE_WIDTH}px`);
    }

    private addEventListeners(onMousemove: (e: MouseEvent) => void) {
        const onMouseup = () => {
            document.removeEventListener('mousemove', onMousemove);
            document.removeEventListener('mouseup', onMouseup);
        };
        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
    }
}
