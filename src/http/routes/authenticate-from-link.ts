import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import dayjs from "dayjs";
import { auth } from "../auth";
import { authLinks } from "../../db/schema";
import { eq } from "drizzle-orm";

export const authenticateFromLink = new Elysia().use(auth).get(
  "/auth-links/authenticate",
  async ({ query, jwt, setCookie, set }) => {
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

    const token = await jwt.sign({
      sub: authLinkFromCode.userId,
      restauranteId: managedRestaurante?.id,
    });

    setCookie("auth", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    await db.delete(authLinks).where(eq(authLinks.code, code));

    set.redirect = redirect;
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  }
);
