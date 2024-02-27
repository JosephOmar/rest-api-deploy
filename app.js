import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
// Otra forma de leer un json
// import { createRequire } from 'node:module'
// const require = createRequire(import.meta.url)
// const movies = require('./movies.json')

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

// metodos normales: GET / HEAD / POST
// metodos complejos: PUT / PATCH / DELETE
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
