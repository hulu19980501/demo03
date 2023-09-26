import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import locale from "antd/locale/zh_CN";
// 状态管理
import { Provider } from "react-redux";
import store from "./redux";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <ConfigProvider locale={locale}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </Provider>
);
