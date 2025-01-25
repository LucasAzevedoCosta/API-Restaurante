import Elysia, { t } from "elysia";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";

export const approveOrder = new Elysia().use(auth).patch(
    '/orders/:orderId/approve',
    async ({ getCurrentUser, set, params }) => {
      const { orderId } = params
      const { restauranteId } = await getCurrentUser()
      if (!restauranteId) {
        throw new UnauthorizedError()
      }
      const order = await db.query.orders.findFirst({
        where(fields, { eq }) {
          return eq(fields.id, orderId)
        },
      })
      if (!order) {
        set.status = 400
        return { message: 'pedido não encontrados.' }
      }
      if (order.status !== 'pending') {
        set.status = 400
        return { message: 'Você só pode aprovar pedidos pendentes.' }
      }
      await db
        .update(orders)
        .set({ status: 'processing' })
        .where(eq(orders.id, orderId))
    },
    {
      params: t.Object({
        orderId: t.String(),
      }),
    },
  )