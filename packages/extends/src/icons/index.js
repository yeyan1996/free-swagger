import Vue from "vue";
import SvgIcon from "@/components/SvgIcon";
Vue.component("svg-icon", SvgIcon);

const ctx = require.context(".", false, /\.svg$/);
const requireAll = ctx => ctx.keys().map(ctx);
requireAll(ctx);
