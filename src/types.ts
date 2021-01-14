type Numbers = 1 | 2 | 3 | 4 | 5;

export type InputData = {
    columns: [string, ...number[]][];
    types: {
        x: string;
        y0: string;
        y1: string;
    };
    names: {
        y0: string;
        y1: string;
    };
    colors: {
        y0: string;
        y1: string;
    };
};

export type Points = Record<keyof InputData['types'], number[]>;