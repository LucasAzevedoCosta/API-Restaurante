import { Elysia, t } from "elysia";
import { restaurants, users } from "../../db/schema";
import { db } from "../../db/connection";
import { z } from "zod";

const registerRestaurantBodySchema = z.object({
  restaurantName: z.string().min(1),
  managerName: z.string().min(1),
  phone: z.string(),
  email: z.string().email(),
});

export const registerRestaurant = new Elysia().post(
  "/restaurants",
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } =
      registerRestaurantBodySchema.parse(body);

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: "manager",
      })
      .returning({
        id: users.id,
      });

    await db.insert(restaurants).values({
      name: restaurantName,
      managerId: manager.id,
    });

    set.status = 204;
  }
);
