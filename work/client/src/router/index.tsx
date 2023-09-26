import { Navigate } from "react-router-dom";
import AccountList from "../views/accountList/accountList";
import Home from "../views/home/home";
// const AccountList = lazy(() => import('../views/accountList/accountList'))
import RoleManage from "../views/roleManage/roleManage";
import Experience from "../views/experience/experience";

//懒加载模式
// const withLoadingComponent = (comp: JSX.Element) => {

//     < React.Suspense fallback={<div>Loading...</div>}>
//      {
//         comp
//      }
//     </React.Suspense>
// }
const routes = [
  {
    path: "/",
    element: <Navigate to="/home/experience" />,
  },
  {
    path: "/home",
    element: <Navigate to="/home/experience" />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "user/list",
        element: <AccountList />,
      },
      {
        path: "experience",
        element: <Experience />,
      },
      {
        path: "user/role",
        element: <RoleManage />,
      },
    ],
  },
  // {
  //     path: "/",
  //     element: <Home/>,
  //     children: [
  //         {
  //             path:'accountList',
  //             element:<AccountList/>
  //         },
  //         {
  //             path:'roleManage',
  //             element:withLoadingComponent(<RoleManage/>)
  //         }
  //     ]
  // },
];
export default routes;
