export type Pagination<T> = {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    count: number;
    data: T[];
}