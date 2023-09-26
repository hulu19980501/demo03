import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import handleRole from "./RoleStatus/reducer";

// 组合各个模块的reducer
const reducers = combineReducers({
  handleRole,
});

// 创建数据仓库
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() 为了让浏览器正常使用redux-dev-tools插件
// const store = legacy_createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// 把仓库数据，浏览器redux-dev-tools，还有reduxThunk插件关联在store中
const store = legacy_createStore(reducers, applyMiddleware(reduxThunk));
export default store;
