import { Elysia, t } from "elysia";
import { db } from "../../db/connection";
import { authLinks } from "../../db/schema";
import { createId } from "@paralleldrive/cuid2";
import { env } from "../../env";

export const sendAuthLink = new Elysia().post('/authenticate', async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
        where(fields, { eq }) {
            return eq(fields.email, email)
        },
    })


    if (!userFromEmail) {
        throw new Error("Usuário não encontrado.")
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
        userId: userFromEmail.id,
        code: authLinkCode,
    })


    //enviar um email para o usuário


    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)

    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    console.log(authLink.toString())
}, 
{
    body: t.Object({
        email: t.String({ format: 'email' }),
    })
})