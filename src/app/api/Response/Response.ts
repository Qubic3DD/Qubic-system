export class Response<T> {
    id!: string;
    failed!: T[];
    passed!: T[];
    requestCompletionStatus!: string;
}
