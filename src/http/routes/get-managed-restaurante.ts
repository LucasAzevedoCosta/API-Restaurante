import Elysia from 'elysia'
import { auth } from '../auth'
import { db } from '../../db/connection'


export const getManagedRestaurante = new Elysia()
  .use(auth)
  .get('/managed-restaurante', async ({ getCurrentUser }) => {
    const { restauranteId } = await getCurrentUser()


    if (!restauranteId) {
      throw new Error("Usuario não é um gerente de restaurante")
    }


    const managedRestaurante = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restauranteId)
      },
    })

    
    if (!managedRestaurante) {
      throw new Error("Restaurante não encontrado")
    }


    return managedRestaurante
  })