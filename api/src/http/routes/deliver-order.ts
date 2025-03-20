import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { orders } from "../../db/schema";
import { db } from "../../db/connection";
import { eq } from "drizzle-orm";

export const deliverOrder = new Elysia().use(auth).patch(
    '/orders/:orderId/deliver',
    async ({ getCurrentUser, set, params }) => {
      const { orderId } = params
      const { restauranteId } = await getCurrentUser()

      if (!restauranteId) {
        throw new UnauthorizedError()
      }

      const order = await db.query.orders.findFirst({
        where(fields, { eq, and }) {
          return and(
            eq(fields.id, orderId),
            eq(fields.restaurantId, restauranteId),
          )
        },
      })

      if (!order) {
        set.status = 400
        return { message: 'Pedido não encontrado.' }
      }

      if (order.status !== 'delivering') {
        set.status = 400
        return {
          message:
            'Você pode entregar pedidos que estam em entrega.',
        }
      }

      await db
        .update(orders)
        .set({ status: 'delivered' })
        .where(eq(orders.id, orderId))
    },
    {
      params: t.Object({
        orderId: t.String(),
      }),
    },
  )