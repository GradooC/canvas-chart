import { ChartBase } from './chart-base';
import { Data } from './chart';
import { Tooltip } from './tooltip';

type Options = {
    width: number;
    height: number;
};

export class ChartMain extends ChartBase {
    private tooltip: Tooltip;
    constructor(data: Data, options: Options) {
        const canvas = document.querySelector('#chart-main') as HTMLCanvasElement;
        super(canvas, data, options);
        this.tooltip = new Tooltip(data);
        this.addEvents();
    }

    private addEvents() {
        let currentPointIndex: number | null = null;
        // TODO Optimization needed
        this.canvas.addEventListener('mousemove', (e) => {
            const closestPointIndex = this.scaledCoords.columns.x.reduce((res, el, index, arr) => {
                return Math.abs(el - e.offsetX) < Math.abs(arr[res] - e.offsetX) ? index : res;
            }, 0);

            this.tooltip.onMove(e);

            if (closestPointIndex !== currentPointIndex) {
                this.tooltip.onPointChange(closestPointIndex);
                this.draw.onPoint(closestPointIndex);
                currentPointIndex = closestPointIndex;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.tooltip.onLeave();
            this.draw.onPoint(null);
            currentPointIndex = null;
        });
    }
}
