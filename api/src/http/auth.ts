import { Elysia, t, type Static } from "elysia";
import jwt from "@elysiajs/jwt";

import { env } from "../env";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { NotAManagerError } from "./errors/not-a-manager-error";

const jwtPayload = t.Object({
  sub: t.String(),
  restauranteId: t.Optional(t.String()),
});

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_A_MANAGER: NotAManagerError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case "UNAUTHORIZED":
        set.status = 401;
        return {
          code,
          message: error.message,
        };
      case "NOT_A_MANAGER":
        set.status = 401;
        return { code, message: error.message };
    }
  })
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    })
  )
  .derive({ as: "scoped" }, ({ jwt, cookie: { auth }, cookie }) => {
    return {
      getCurrentUser: async () => {
        const payload = await jwt.verify(cookie.auth);

        if (!payload) {
          throw new UnauthorizedError();
        }

        return {
          userId: payload.sub,
          restauranteId: payload.restauranteId,
        };
      },
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        auth.value = token;
        auth.httpOnly = true;
        auth.maxAge = 60 * 60 * 24 * 7; // 7 days
        auth.path = "/";
      },

      signOut: async () => {
        auth.remove();
      },
    };
  })
  .derive({ as: "scoped" }, ({ getCurrentUser }) => {
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
