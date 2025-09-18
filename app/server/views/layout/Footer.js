import { jsx as s, jsxs as o, Fragment as r } from "hono/jsx/jsx-runtime";
export default (({ vite_js: e })=>o(r, {
        children: [
            s("footer", {
                class: "footer"
            }),
            s("script", {
                type: "module",
                src: e
            })
        ]
    }));
