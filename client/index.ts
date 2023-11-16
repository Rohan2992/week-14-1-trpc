import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
      async headers() {
        return {
          authorization: "Bearer 1234"
        };
      }
    })
  ]
});

const main = async () => {
  /**
   * const toDo = await trpc.createTodo.query({
   *   title: "Rohan@123.com",
   *   description: "password"
   * });
   * console.log(toDo);
   */

  const newUser = await trpc.signUp.mutate({
    email: "Roohan@123.com",
    password: "password"
  });
  console.log(newUser);
};

main();
