"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@trpc/server/adapters/standalone");
const trpc_1 = require("./trpc");
const zod_1 = require("zod");
const appRouter = (0, trpc_1.router)({
    createTodo: trpc_1.publicProcedure
        .input(zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string()
    }))
        .query((opts) => __awaiter(void 0, void 0, void 0, function* () {
        const title = opts.input.title;
        const description = opts.input.description;
        console.log("I m inside the server index.ts");
        return { id: "1", title, description };
    })),
    signUp: trpc_1.publicProcedure
        .input(zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string() }))
        .mutation((opts) => __awaiter(void 0, void 0, void 0, function* () {
        const username = opts.ctx.username;
        const email = opts.input.email;
        const password = opts.input.password;
        console.log(username);
        return { id: "New", username, email, password };
    }))
});
const server = (0, standalone_1.createHTTPServer)({
    router: appRouter,
    createContext(opts) {
        const authHeaders = opts.req.headers["authorization"];
        console.log(authHeaders);
        return { username: authHeaders };
    }
});
server.listen(3000);
