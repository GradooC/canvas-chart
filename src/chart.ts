import { Slider } from './slider';
import { MAP_HEIGHT_PERCENT, DEFAULT_WIDTH, DEFAULT_HEIGHT } from './constants';
import template from './templates/chart-template.html';
import { ChartMain } from './chart-main';
import { InputData } from './data/chart_data.json';
import { Checkboxes } from './checkboxes';
import { Columns, Data } from './types';

type Options = {
    width?: number;
    height?: number;
};

export class Chart {
    data: Data;
    constructor(
        data: InputData,
        box: HTMLDivElement,
        { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }: Options = {}
    ) {
        this.data = this.transformData(data);

        box.insertAdjacentHTML('beforeend', template);

        const sliderOptions = { width, height: height * MAP_HEIGHT_PERCENT };
        const mainChartOptions = { width, height: height * (1 - MAP_HEIGHT_PERCENT) };
        const mainChart = new ChartMain(this.data, mainChartOptions);
        new Slider(this.data, mainChart, sliderOptions);
        // new Checkboxes(this.data, mainChart);
    }

    private transformData(data: InputData) {
        const transformedColumns = data.columns.reduce(
            (acc, [first, ...rest]) => ({ ...acc, [first]: rest }),
            {} as Columns
        );
        const display = Object.keys(data.names).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {} as Data['display']
        );
        return { ...data, columns: transformedColumns, display };
    }
}
