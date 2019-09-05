export interface VoteQuery {
    title: string;
    address: string;
    initiator: string;  // account publickey
    content: string;
    type: number;   // 0=>radio   1=>multiple
    timestamp: number;
    endtime: number;
    starttime: number;
    voteDataDOList: VoteDataQuery[];
}

export interface VoteDataQuery {
    description: string;
}
