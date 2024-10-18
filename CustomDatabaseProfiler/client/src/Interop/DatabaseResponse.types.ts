export type DatabaseResponse = {
    queryParseTime: number;
    queryExecutionTime: number;
    /**
     * json response from the database, needs to be parsed
     */
    queryResponse: string;
};

export type QueryMessage = {
    query: string,
    clientId: string
}

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

export type HeartbeatMessage = {
    clientId: string;
}