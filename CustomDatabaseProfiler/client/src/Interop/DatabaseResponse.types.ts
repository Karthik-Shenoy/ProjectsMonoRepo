export type DatabaseResponse = {
    queryParseTime: number;
    queryExecutionTime: number;
    /**
     * json response from the database, needs to be parsed
     */
    queryResponse: string;
};

export type QueryResponse = {
    successful: boolean;
    record?: {
        key: string;
        value: string;
    };
};

export type DatabaseRecord = {
    key: string;
    value: string;
};
