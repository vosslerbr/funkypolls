const expirationMap = {
  dbToClient: {
    FIVE_MINUTES: "5 minutes",
    TEN_MINUTES: "10 minutes",
    FIFTEEN_MINUTES: "15 minutes",
  },
  clientToDb: {
    "5 minutes": "FIVE_MINUTES",
    "10 minutes": "TEN_MINUTES",
    "15 minutes": "FIFTEEN_MINUTES",
  },
};

export default expirationMap;
