import axios from "axios";

interface Options {
  path: string;
  method: "get" | "post" | "put" | "delete";
  body?: any;
}

const apiRequest = async ({ path, method, body }: Options) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  const { data } = await axios[method](url, body);

  return data;
};

export default apiRequest;
