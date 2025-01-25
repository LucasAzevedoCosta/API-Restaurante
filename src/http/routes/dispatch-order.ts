import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { db } from "../../db/connection";
import { orders } from "../../db/schema";
import { eq } from "drizzle-orm";

export const dispatchOrder = new Elysia().use(auth).patch(
    '/orders/:orderId/dispatch',
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
        return { message: 'Pedido não encontrado.' }
      }

      if (order.status !== 'processing') {
        set.status = 400
        return {
          message:
            'Você não pode encaminar pedidos que ainda nao foram processados.',
        }
      }

      await db
        .update(orders)
        .set({ status: 'delivering' })
        .where(eq(orders.id, orderId))
    },
    {
      params: t.Object({
        orderId: t.String(),
      }),
    },
  )