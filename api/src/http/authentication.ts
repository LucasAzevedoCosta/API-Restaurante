import jwt from "@elysiajs/jwt";
import Elysia, { t, type Static } from "elysia";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { NotAManagerError } from "./errors/not-a-manager-error";
import { env } from "bun";
import cookie from "@elysiajs/cookie";

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restauranteId: t.Optional(t.String()),
});

export const authentication = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_A_MANAGER: NotAManagerError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UNAUTHORIZED":
        set.status = 401;
        return { code, message: error.message };
      case "NOT_A_MANAGER":
        set.status = 401;
        return { code, message: error.message };
    }
  })
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    })
  )
  .use(cookie())
  .derive(({ jwt, cookie, setCookie, removeCookie }) => {
    return {
      getCurrentUser: async () => {
        const payload = await jwt.verify(cookie.auth);

        if (!payload) {
          throw new UnauthorizedError();
        }

        return payload;
      },
      signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
        setCookie("auth", await jwt.sign(payload), {
          httpOnly: true,
          maxAge: 7 * 86400,
          path: "/",
        });
      },
      signOut: () => {
        removeCookie("auth");
      },
    };
  })
  .derive(({ getCurrentUser }) => {
    return {
      getManagedRestaurantId: async () => {
        const { restauranteId } = await getCurrentUser();

        if (!restauranteId) {
          throw new NotAManagerError();
        }

        return restauranteId;
      },
    };
  });
