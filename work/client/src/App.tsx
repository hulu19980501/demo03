import { useRoutes } from "react-router-dom";
import "./App.css";
import "antd/dist/reset.css";
import Router from "./router/index";
import "dayjs/locale/zh-cn";

function App() {
  const outlet = useRoutes(Router);
  return <div className="App">{outlet}</div>;
}

export default App;
