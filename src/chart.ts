import { ChartMap } from './chart-map';
import { MAP_HEIGHT_PERCENT } from './constants';
import { DrawChart } from './draw-chart';

import template from './templates/chart-template.html';
import { InputData } from './types';

type Options = {
    width?: number;
    height?: number;
};

export class Chart {
    constructor(data: InputData, box: HTMLDivElement, { width = 900, height = 400 }: Options = {}) {
        box.insertAdjacentHTML('beforeend', template);
        const size = { width, height: height * MAP_HEIGHT_PERCENT };
        new DrawChart(data, size);
        new ChartMap(size);

        
    }
}
