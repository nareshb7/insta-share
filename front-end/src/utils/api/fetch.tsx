import { BE_URL } from "../../store/api/MessagesApi";

type MyHeaders = {
  [key: string]: string;
};

const get = async (url: string, headers: MyHeaders) => {
  return fetch(`${BE_URL}${url}`, {
    method: 'GET',
    headers,
  })
    .then((res) => res.json())
    .then((dt) => dt)
    .catch((er) => er);
};

const post = async (
  url: string,
  headers: MyHeaders = { 'Content-Type': 'application/json' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  return fetch(`${BE_URL}${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((dt) => dt)
    .catch((er) => er);
};
const httpMethods = {get, post}
export default httpMethods;
