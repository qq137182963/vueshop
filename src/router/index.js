import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () =>
    import ('../components/Login.vue');
const Home = () =>
    import ('../components/Home.vue');
const Welcome = () =>
    import ('../components/Welcome.vue')
const Users = () =>
    import ('../components/user/Users.vue')
const Rights = () =>
    import ('../components/power/Rights.vue')
const Roles = () =>
    import ('../components/power/Roles.vue')
const Cate = () =>
    import ('../components/goods/Cate.vue')
const Params = () =>
    import ('../components/goods/Params.vue')
const Goods = () =>
    import ('../components/goods/Goods.vue')
const Add = () =>
    import ('../components/goods/Add.vue')
const Order = () =>
    import ('../components/order/Order.vue')
const Report = () =>
    import ('../components/report/Report.vue')
Vue.use(VueRouter)

const routes = [{
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/home",
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Users
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Cate
            },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/goods',
                component: Goods
            },
            {
                path: '/goods/add',
                component: Add
            },
            {
                path: '/orders',
                component: Order
            },
            {
                path: '/reports',
                component: Report
            }
        ]
    }
]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) return next("login");
    next()
})

export default router
