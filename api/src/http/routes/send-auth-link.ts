import { Elysia, t } from "elysia";
import nodemailer from "nodemailer";
import { db } from "../../db/connection";
import { authLinks } from "../../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { env } from "../../env";
import { mail } from "../../lib/mail";

export const sendAuthLink = new Elysia().post(
  "/authenticate",
  async ({ body }) => {
    const { email } = body;

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });

    if (!userFromEmail) {
      throw new Error("Usuário não encontrado.");
    }

    const authLinkCode = createId();

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    });

    const authLink = new URL("/auth-links/authenticate", env.AUTH_REDIRECT_URL);

    authLink.searchParams.set("code", authLinkCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

    const info = await mail.sendMail({
      from: {
        name: "Lucas's Food",
        address: "hi@Lucas'sFood.com",
      },
      to: email,
      subject: "[Lucas's Food] Link para login",
      text: `Use o link abaixo para autenticar sua conta no Lucas's Food: ${authLink.toString()}`,
    });
      console.log(nodemailer.getTestMessageUrl(info));
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
    }),
  }
);
