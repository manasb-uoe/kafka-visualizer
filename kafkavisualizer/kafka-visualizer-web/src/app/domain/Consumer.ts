export class Consumer {
    public consumerId: string;
    public clientId: string;
    public groupId: string;
    public assignments: Array<Assignment>;
}

export class Assignment {
    public topic: string;
    public partition: number;
}