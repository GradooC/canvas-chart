import { Data } from './chart';
import {
    TOOLTIP_OFFSET_X,
    TOOLTIP_OFFSET_Y,
    TOOLTIP_WIDTH,
    ALT_TOOLTIP_OFFSET_X,
} from './constants';

type Row = {
    color: string;
    name: string;
    amount: number;
};

export class Tooltip {
    private tooltip: HTMLDivElement;
    private header: HTMLHeadingElement;
    private list: HTMLUListElement;
    constructor(private data: Data) {
        this.tooltip = document.querySelector('.tooltip') as HTMLDivElement;
        this.header = document.querySelector('.tooltip h3') as HTMLHeadingElement;
        this.list = document.querySelector('.tooltip ul') as HTMLUListElement;
        this.setCSSVars();
    }

    onMove(e: MouseEvent) {
        const viewportWidth = window.visualViewport.width;
        const currentXOffset =
        e.pageX + TOOLTIP_OFFSET_X + TOOLTIP_WIDTH < viewportWidth
        ? TOOLTIP_OFFSET_X
        : ALT_TOOLTIP_OFFSET_X;
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${e.offsetX + currentXOffset}px`;
        this.tooltip.style.top = `${e.offsetY + TOOLTIP_OFFSET_Y}px`;
    }

    onPointChange(index: number) {
        const { data } = this;
        const date = new Date(data.columns.x[index]);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const day = new Intl.DateTimeFormat('en-US', options).format(date);
        this.header.innerHTML = day;

        const rows = Object.keys(data.names).reduce(
            (acc, key) => [
                ...acc,
                {
                    name: data.names[key as keyof typeof data['names']],
                    color: data.colors[key as keyof typeof data['names']],
                    amount: data.columns[key as keyof typeof data['names']][index],
                },
            ],
            [] as Row[]
        );

        const rowsHtml = rows.map(
            // prettier-ignore
            (row) =>
            `<li>
                <p>${row.name}</p>
                <p style="color: ${row.color}">${row.amount}</p>
            </li>`
        );
        this.list.innerHTML = rowsHtml.join('');
    }

    onLeave() {
        this.tooltip.style.display = 'none';
    }

    private setCSSVars() {
        this.tooltip.style.setProperty('--tooltip-width', `${TOOLTIP_WIDTH}px`);
    }
}
