export interface Consumer {
    consumerId: string;
    clientId: string;
    groupId: string;
    assignments: Assignment[];
}

export interface Assignment {
    topic: string;
    partition: number;
}