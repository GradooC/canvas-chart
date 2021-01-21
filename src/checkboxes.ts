import { ChartMain } from './chart-main';
import { Data } from './types';

type Checkbox = {
    key: string;
    name: string;
    color: string;
};
type Dataset = keyof Data['names'] | undefined;

export class Checkboxes {
    checkboxes: HTMLDivElement;
    constructor(private data: Data, private mainChart: ChartMain) {
        this.checkboxes = document.querySelector('.checkboxes') as HTMLDivElement;

        this.buildCheckboxes();
        this.addEvent();
    }

    addEvent() {
        this.checkboxes.addEventListener('click', (e) => {
            e.preventDefault();
            const input = (e.target as HTMLDivElement).firstChild as HTMLInputElement;
            // if (Object.values(this.mainChart.scaledCoords.display).filter((val) => val).length > 1) {
                input.checked = !input.checked;
                const clickedName = (e.target as HTMLDivElement).dataset.name as Dataset;
                // clickedName && this.mainChart.onCheckboxClick(clickedName);
            // }
        });
    }

    buildCheckboxes() {
        const { data } = this;
        const checkboxSettings = Object.keys(data.names).reduce(
            (acc, key) => [
                ...acc,
                {
                    key,
                    name: data.names[key as keyof typeof data['names']],
                    color: data.colors[key as keyof typeof data['names']],
                },
            ],
            [] as Checkbox[]
        );
        const checkboxesHtml = checkboxSettings.map(
            // prettier-ignore
            ({name, color, key}) =>
                `<label class="container" data-name="${key}" style="--color: ${color}">
                    <input type="checkbox" checked="checked" />
                    <div class="background"></div>
                    <span class="name">${name}</span>
                </label>`
        );
        this.checkboxes.insertAdjacentHTML(
            'afterbegin',
            checkboxesHtml.join('').replace(/\n | \s{2,}/g, '')
        );
    }
}
