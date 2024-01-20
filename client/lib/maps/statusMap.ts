import { Status } from "@prisma/client";

const statusMap: {
  dbToClient: { [key in Status]: string };
  clientToDb: { [key: string]: Status };
} = {
  dbToClient: {
    OPEN: "Open",
    CLOSED: "Closed",
  },
  clientToDb: {
    Open: "OPEN",
    Closed: "CLOSED",
  },
};

export default statusMap;
