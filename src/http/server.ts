import { Elysia } from "elysia";

const app = new Elysia()
    .get("/", () => {
        return "Hello from Elysia"
    })

app.listen(3333, () => {
    console.log("HTTP está rodando")
})