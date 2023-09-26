import { AxiosResponse } from "axios";
import {
  getRoleList,
  updateRole,
  addRole,
  deleteRole,
} from "../../services/role";
const store = {
  state: {
    sarr: [10, 20, 30],
    rolelist: [
      {
        id: "",
        name: "",
        description: "",
        useCount: 0,
      },
    ],
  },
  actions: {
    sarrpush(
      newState: { sarr: number[] },
      action: { type: string; val: number }
    ) {
      // console.log('sarr被调用')
      newState.sarr.push(action.val);
    },
    setrolelist(
      newState: {
        rolelist: {
          name: string;
          id: string;
          useCount: number;
          description: string;
        }[];
      },
      action: {
        type: string;
        val: {
          name: string;
          id: string;
          useCount: number;
          description: string;
        }[];
      }
    ) {
      newState.rolelist = action.val;
      // console.log("role")
      // console.log(newState.rolelist)
    },
  },
  asyncActions: {
    // 只放异步的方法
    async getrolelist(dispatch: Function) {
      await getRoleList().then((res) => {
        dispatch({ type: "setrolelist", val: res.data.data.result });
      });
    },

    async addrole(dispatch: Function, params: { name: any; description: any }) {
      await addRole(params).then(() => {
        dispatch(store.asyncActions.getrolelist);
      });
    },
    async updaterole(
      dispatch: Function,
      params: { name: any; description: any },
      id: string
    ) {
      await updateRole(params, id).then((res) => {
        dispatch(store.asyncActions.getrolelist);
        // console.log(res)
      });
    },
    async deleterole(dispatch: Function, id: string) {
      let data: AxiosResponse<any, any>;
      await deleteRole(id).then((res) => {
        dispatch(store.asyncActions.getrolelist);
        data = res;
        // console.log(data)
      });
      return data;
    },
  },

  actionNames: {},
};
let actionNames = {};
for (let key in store.actions) {
  actionNames[key] = key;
}
store.actionNames = actionNames;

export default store;
