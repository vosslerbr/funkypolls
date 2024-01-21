import { Status } from "@prisma/client";

const statusMap: {
  dbToClient: { [key in Status]: string };
  clientToDb: { [key: string]: Status };
} = {
  dbToClient: {
    OPEN: "Open",
    DRAFT: "Draft",
    EXPIRED: "Expired",
    ARCHIVED: "Archived",
  },
  clientToDb: {
    Open: "OPEN",
    Draft: "DRAFT",
    Expired: "EXPIRED",
    Archived: "ARCHIVED",
  },
};

export default statusMap;
