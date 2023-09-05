import mongoose from 'mongoose'

// URL de conexión a la base de datos. Cambia esto según tu configuración.
const dbURL = 'mongodb+srv://SolidSnake:gRpu6SxPSWOLTIS6@cluster0.0lyn4ju.mongodb.net/MarketPlace'

// Configuración de la conexión a la base de datos
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Manejo de eventos de conexión
const db = mongoose.connection

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'))
db.once('open', () => {
  console.log('Conexión exitosa a la base de datos MongoDB')
})

export default db
