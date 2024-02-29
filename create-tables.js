import pgPromise from 'pg-promise'
import { config } from 'dotenv'

config()

const pgp = pgPromise()

const createTables = async () => {
  const client = pgp({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })

  try {
    const createTablesQuery = `
      INSERT INTO genre (name) VALUES
      ('Fantasy');
    `

    await client.none(createTablesQuery)
    console.log('Tablas creadas exitosamente')
  } catch (error) {
    console.error('Error al crear las tablas:', error)
  } finally {
    pgp.end()
  }
}

createTables()
