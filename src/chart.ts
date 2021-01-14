import { Slider } from './slider';
import { MAP_HEIGHT_PERCENT, DEFAULT_WIDTH, DEFAULT_HEIGHT } from './constants';
import template from './templates/chart-template.html';
import { InputData, Columns } from './types';
import { ChartMain } from './chart-main';

export type Data = ReturnType<typeof Chart.transformData>;

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
        this.data = Chart.transformData(data);
        box.insertAdjacentHTML('beforeend', template);

        const sliderOptions = { width, height: height * MAP_HEIGHT_PERCENT };
        const mainChartOptions = { width, height: height * (1 - MAP_HEIGHT_PERCENT) };

        new Slider(this.data, sliderOptions);
        new ChartMain(this.data, mainChartOptions);
    }

    static transformData(data: InputData) {
        const transformedColumns = data.columns.reduce(
            (acc, [first, ...rest]) => ({ ...acc, [first]: rest }),
            {} as Columns
        );
        return { ...data, columns: transformedColumns };
    }
}
