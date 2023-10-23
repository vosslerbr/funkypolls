export interface PollGetResponse {
  poll: Poll;
  answers: Answer[];
  links: {
    resultsUrl: string;
    voteUrl: string;
  };
}
