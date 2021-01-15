import { ChartBase } from './chart-base';
import { Data } from './chart';

type Options = {
    width: number;
    height: number;
};

export class ChartMain extends ChartBase {
    constructor(data: Data, options: Options) {
        const canvas = document.querySelector('#chart-main') as HTMLCanvasElement;
        super(canvas, data, options);

        this.addEvents();
    }

    addEvents() {
        let currentPointIndex: number | null = null;
        // TODO Optimization needed
        this.canvas.addEventListener('mousemove', (e) => {
            const closestPointIndex = this.scaledCoords.x.reduce((res, el, index, arr) => {
                return Math.abs(el - e.offsetX) < Math.abs(arr[res] - e.offsetX) ? index : res;
            }, 0);
            if (closestPointIndex !== currentPointIndex) {
                this.draw.onPoint(closestPointIndex);
                currentPointIndex = closestPointIndex;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.draw.onPoint(null);
            currentPointIndex = null;
        });
    }
}
