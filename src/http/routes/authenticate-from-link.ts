import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import dayjs from "dayjs";
import { auth } from "../auth";
import { authLinks } from "../../db/schema";
import { eq } from "drizzle-orm";

export const authenticateFromLink = new Elysia().use(auth).get(
  "/auth-links/authenticate",
  async ({ query, signUser, set }) => {
    const { code, redirect } = query;

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code);
      },
    });

    if (!authLinkFromCode) {
      throw new Error("link da autenticação não encontrado.");
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.creatdAt,
      "days"
    );

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error("Auth link expirado, por favor solicite um novo link.");
    }

    const managedRestaurante = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId);
      },
    });

    await signUser({
      sub: authLinkFromCode.userId,
      restauranteId: managedRestaurante?.id,
    });

    await db.delete(authLinks).where(eq(authLinks.code, code));

    //set.redirect = redirect;
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  }
);
