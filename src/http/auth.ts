import  { Elysia, t, type Static } from "elysia";
import jwt from "@elysiajs/jwt";
import cookie from "@elysiajs/cookie";

import { env } from "../env";

const jwtPayload = t.Object({
  sub: t.String(),
  restauranteId: t.Optional(t.String()),
})

export const auth = new Elysia().use(
  jwt({
    secret: env.JWT_SECRET_KEY,
    schema: jwtPayload,
  }),
)  
.derive({ as: 'scoped' }, ({ jwt, cookie: { auth }, cookie }) => {
  return {
    signUser: async (payload: Static<typeof jwtPayload>) => {
      const token = await jwt.sign(payload)

      auth.value = token
      auth.httpOnly = true
      auth.maxAge = 60 * 60 * 24 * 7 // 7 days
      auth.path = '/'
    },

    signOut: async () => {
      auth.remove()
    },


    getCurrentUser: async () => {

      const payload = await jwt.verify(cookie.auth)


      if (!payload) {
        throw new Error("Não autenticado")
      }


      return {
        userId: payload.sub,
        restauranteId: payload.restauranteId,
      }
    },
  }
})