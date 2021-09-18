import AdminLayout from "./layouts/Admin"
import BasicLayout from "./layouts/Basic"
import Login from "./components/auth/Login"
import ForgotPassword from "./components/auth/ForgotPassword"
import E404 from "./components/error/404"
import E403 from "./components/error/403"

const _authRoutes = [
    {
        path: "",
        redirect: "login",
        component: BasicLayout,
        children: [
            {
                path: "/login",
                name: "login",
                component: Login,
                meta: {
                    title: "登录",
                },
            },
            {
                path: "/forgot-password",
                name: "forgotPassword",
                component: ForgotPassword,
                meta: {
                    title: "忘记密码",
                },
            },
        ],
    },
];
const _otherRoutes = [
    {
        path: "",
        name: "error",
        component: BasicLayout,
        children: [
            {
                path: "/404",
                name: "error404",
                component: E404,
            },
            {
                path: "/403",
                name: "error403",
                component: E403,
            },
        ],
    },
    {
        path: "*",
        name: "default",
        redirect: "/404",
    },
];

const _adminRoutes = [
    {
        path: "",
        _adminRoot: true,
        component: AdminLayout,
        children: [
            {
                path: "/",
                name: "index",
                component: () => import('../views/Index'),
                meta: {
                    title: "仪表盘",
                    icon: "mdi-view-dashboard-variant",
                    authenticated: true,
                },
            },
        ],
    },
]

export default [].concat(_adminRoutes).concat(_authRoutes).concat(_otherRoutes)
