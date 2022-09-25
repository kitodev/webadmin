export interface TableCol<T> {
    field: T;
    label: string;
    sort?: boolean;
    hidden?: boolean;
}

export interface ColumnSetting {
    primaryKey: string;
    header?: string;
    format?: PipeFormat;
}

export enum PipeFormat {
    DEFAULT,
    CURRENCY,
    DATE,
    PERCENTAGE
}