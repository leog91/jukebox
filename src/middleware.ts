import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/",

        "/pick"
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/",],
};
