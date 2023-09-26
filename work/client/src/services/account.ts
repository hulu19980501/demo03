import axios from "axios";

export function getAccountList(params: any) {
  return axios({
    method: "get",
    url: "/api/accounts",
    params: params,
  });
}

export function updateAccount(params: any, id: string) {
  return axios({
    method: "put",
    url: "api/accounts/" + id,
    data: params,
  });
}

export function deleteAccount(id: string) {
  return axios({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "delete",
    url: "api/accounts/" + id,
  });
}

export function addAccount(params: any) {
  return axios({
    method: "post",
    url: "api/accounts",
    data: params,
  });
}
