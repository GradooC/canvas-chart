import { Chart } from './chart';
import data from './data/chart_data.json';

const box = document.querySelector('.box') as HTMLDivElement;
new Chart(data, box);
