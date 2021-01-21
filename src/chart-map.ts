import { Data } from './types';
import { ChartBase } from './chart-base';

type Options = {
    width: number;
    height: number;
};

export class ChartMap extends ChartBase {
    constructor(data: Data, options: Options) {
        const canvas = document.querySelector('#slider-map') as HTMLCanvasElement;
        super(canvas, data, options);
    }
}
