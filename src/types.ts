export type Columns = {
    x: number[];
    y0: number[];
    y1: number[];
};

export type Data = {
    columns: Columns;
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
    display: {
        y0: boolean;
        y1: boolean;
    }
};
