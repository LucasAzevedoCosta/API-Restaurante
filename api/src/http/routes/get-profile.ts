import Elysia from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { authentication } from "../authentication";

export const getProfile = new Elysia()
  .use(authentication)
  .get('/me', async ({ getCurrentUser }) => {
    const { userId, restauranteId } = await getCurrentUser()

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      throw new UnauthorizedError()
    }

    return `Hello ${user}`
  })