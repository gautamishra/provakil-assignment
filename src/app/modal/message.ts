
export interface Message {
    channel: string;
    createdAt: Date;
    id: number;
    msg: string;
    username: string;
}

export interface Createmessage {
    username: string;
    msg: string;
    channel: string;
}
