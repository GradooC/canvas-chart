import { ChartMap } from './chart-map';
import { Data } from './chart';
import {
    MIN_VIEWPORT_WIDTH,
    EDGE_WIDTH,
    SIDE_ELEMENTS_COLOR,
    VIEWPORT_EDGE_COLOR,
} from './constants';
import './scss/index.scss';
import { ChartMain } from './chart-main';
import { Columns } from './types';

type Dimensions = {
    fromLeft: number;
    fromRight: number;
};

type Options = {
    width: number;
    height: number;
};

export class Slider {
    private slider: HTMLDivElement;
    private viewport: HTMLDivElement;
    private leftVPEdge: HTMLDivElement;
    private rightVPEdge: HTMLDivElement;
    private left: HTMLDivElement;
    private right: HTMLDivElement;
    private dimensions: Dimensions = {
        fromLeft: 0,
        fromRight: 0,
    };
    constructor(private data: Data, private mainChart: ChartMain, private options: Options) {
        this.slider = document.querySelector('.slider') as HTMLDivElement;
        this.viewport = document.querySelector('.viewport') as HTMLDivElement;
        this.leftVPEdge = document.querySelector('.viewport-left-edge') as HTMLDivElement;
        this.rightVPEdge = document.querySelector('.viewport-right-edge') as HTMLDivElement;
        this.left = document.querySelector('.left') as HTMLDivElement;
        this.right = document.querySelector('.right') as HTMLDivElement;

        this.setCSSVars();
        this.setPosition();
        this.handleDrag();
        this.handleLeftSideResize();
        this.handleRightSideResize();
        this.drawData();
    }

    private drawData() {
        new ChartMap(this.data, this.options);
    }

    private handleDrag() {
        this.viewport.addEventListener('mousedown', (event) => {
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

    private handleLeftSideResize() {
        this.leftVPEdge.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            let startX = event.pageX;

            const onMousemove = (e: MouseEvent) => {
                const delta = startX - e.pageX;
                this.calculateLeftSideResize(delta);
                this.setPosition();

                startX = e.pageX;
            };

            this.addEventListeners(onMousemove);
        });
    }

    private handleRightSideResize() {
        this.rightVPEdge.addEventListener('mousedown', (event) => {
            event.stopPropagation();
            let startX = event.pageX;

            const onMousemove = (e: MouseEvent) => {
                const delta = startX - e.pageX;
                this.calculateRightSideResize(delta);
                this.setPosition();

                startX = e.pageX;
            };

            this.addEventListeners(onMousemove);
        });
    }

    private calculateDrag(delta: number) {
        const sliderRect = this.slider.getBoundingClientRect();
        const viewportRect = this.viewport.getBoundingClientRect();

        let fromLeft = viewportRect.left - sliderRect.left - delta;
        let fromRight = sliderRect.right - viewportRect.right + delta;
        if (fromLeft < 0) {
            fromLeft = 0;
            fromRight = sliderRect.width - viewportRect.width;
        }
        if (fromRight < 0) {
            fromRight = 0;
            fromLeft = sliderRect.width - viewportRect.width;
        }
        this.setDimensions({ fromLeft, fromRight });

        this.calculateDataRange();
    }

    private calculateLeftSideResize(delta: number) {
        const sliderRect = this.slider.getBoundingClientRect();
        const viewportRect = this.viewport.getBoundingClientRect();

        const maxFromLeft = sliderRect.width - this.dimensions.fromRight - MIN_VIEWPORT_WIDTH;
        let fromLeft = viewportRect.left - sliderRect.left - delta;
        if (fromLeft < 0) {
            fromLeft = 0;
        }
        if (fromLeft > maxFromLeft) {
            fromLeft = maxFromLeft;
        }
        this.setDimensions({ fromLeft });

        this.calculateDataRange();
    }

    private calculateRightSideResize(delta: number) {
        const sliderRect = this.slider.getBoundingClientRect();
        const viewportRect = this.viewport.getBoundingClientRect();

        const maxFromRight = sliderRect.width - this.dimensions.fromLeft - MIN_VIEWPORT_WIDTH;
        let fromRight = sliderRect.right - viewportRect.right + delta;
        if (fromRight < 0) {
            fromRight = 0;
        }
        if (fromRight > maxFromRight) {
            fromRight = maxFromRight;
        }
        this.setDimensions({ fromRight });

        this.calculateDataRange();
    }

    private calculateDataRange() {
        const sliderRect = this.slider.getBoundingClientRect();
        const viewportRect = this.viewport.getBoundingClientRect();

        const dataOffsetPercent = Math.abs(sliderRect.left - viewportRect.left) / sliderRect.width;
        const dataWidthPercent = viewportRect.width / sliderRect.width;

        const { length } = this.mainChart.data.columns.x;
        const firstIndex = Math.round(length * dataOffsetPercent);
        const lastIndex = firstIndex + Math.round(length * dataWidthPercent);

        this.mainChart.calculateDisplayedData(firstIndex, lastIndex);
        this.mainChart.draw.onChangeDataSet();
    }

    private setDimensions(newDimensions: Partial<Dimensions>) {
        this.dimensions = {
            ...this.dimensions,
            ...newDimensions,
        };
    }

    private setPosition() {
        this.viewport.style.left = `${this.dimensions.fromLeft}px`;
        this.viewport.style.right = `${this.dimensions.fromRight}px`;

        const viewportRect = this.viewport.getBoundingClientRect();
        const leftElRightProp = viewportRect.width + this.dimensions.fromRight;
        const rightElLeftProp = viewportRect.width + this.dimensions.fromLeft;

        this.left.style.left = `0px`;
        this.left.style.right = `${leftElRightProp}px`;

        this.right.style.left = `${rightElLeftProp}px`;
        this.right.style.right = '0px';
    }

    private setCSSVars() {
        const root = document.querySelector('.chart') as HTMLDivElement;
        root.style.setProperty('--edge-width', `${EDGE_WIDTH}px`);
        root.style.setProperty('--width', `${this.options.width}px`);
        root.style.setProperty('--slider-height', `${this.options.height}px`);
        root.style.setProperty('--side-color', SIDE_ELEMENTS_COLOR);
        root.style.setProperty('--edge-color', VIEWPORT_EDGE_COLOR);
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
