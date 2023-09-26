import axios from "axios";

export function getRoleList() {
  return axios({
    method: "get",
    url: "/api/role",
  });
}

export function updateRole(params: any, id: string) {
  return axios({
    method: "put",
    url: "api/role/" + id,
    data: params,
  });
}

export function deleteRole(id: string) {
  return axios({
    method: "delete",
    url: "api/role/" + id,
  });
}

export function addRole(params: any) {
  return axios({
    method: "post",
    url: "api/role",
    data: params,
  });
}
