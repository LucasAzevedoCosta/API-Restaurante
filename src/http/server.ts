import { Elysia, t } from "elysia";
import { registerRestaurant } from "./routes/register-restaurant";
import { sendAuthLink } from "./routes/send-auth-link";
import { env } from "../env";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";

const app = new Elysia().use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: t.Object({
        sub: t.String(),
        restauranteId: t.Optional(t.String()),
      }),
    }),
  )
  .use(cookie())
  .use(registerRestaurant)
  .use(sendAuthLink)

app.listen(3333, () => {
    console.log("HTTP está rodando")
})