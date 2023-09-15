import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import MoneyMakerView from "@/views/MoneyMaker.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '/index',
        component: MoneyMakerView,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
