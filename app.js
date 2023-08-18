import express, { json } from 'express' // require -> commonJS
import categoryRouter  from './routes/category.js'
import payment_typeRouter  from './routes/payment_type.js'
//import { corsMiddleware } from './middlewares/cors.js'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import db from './config/database.js'

console.clear();
const app = express()
app.use(json())
//app.use(corsMiddleware())
app.disable('x-powered-by')


app.use('/category', categoryRouter)
app.use('/payment_type', payment_typeRouter)

const PORT = 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})