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

        this.drawData()
    }

    drawData() {
        this.draw.drawPolyline();
    }
}
