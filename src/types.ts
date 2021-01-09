export type Data = {
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

export type Points = Record<keyof Data['types'], number[]>;