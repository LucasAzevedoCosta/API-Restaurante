import { eq } from "drizzle-orm"
import { db } from "../../db/connection"
import { auth } from "../auth"
import { UnauthorizedError } from "../errors/unauthorized-error"
import { orders } from "../../db/schema"
import Elysia, { t } from "elysia"

export const cancelOrder = new Elysia().use(auth).patch(
    '/orders/:orderId/cancel',
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

      if (!['pending', 'processing'].includes(order.status)) {
        set.status = 400
        return { message: 'Voce pode cancelar pedidos que já foram enviados.' }
      }

      await db
        .update(orders)
        .set({ status: 'canceled' })
        .where(eq(orders.id, orderId))
    },
    {
      params: t.Object({
        orderId: t.String(),
      }),
    },
  )