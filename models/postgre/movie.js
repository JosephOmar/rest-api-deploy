import pgPromise from 'pg-promise'
import { config } from 'dotenv'

config()

const pgp = pgPromise({

})

const client = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

export class MovieModel {
  static async getAll ({ genre }) {
    const movies = await client.query(
      'SELECT * FROM movie'
    )

    return movies
  }

  static async getById ({ id }) {
    const movie = await client.query(
      'SELECT * FROM movies WHERE id = $1',
      [id]
    )

    if (movie.length === 0) return null

    return movie
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const uuidResult = await client.query('SELECT uuid_generate_v4()')
    const uuid = uuidResult[0].uuid_generate_v4

    try {
      // Insertar película en la tabla movie
      await client.query(
            `INSERT INTO movie (id, title, year, director, duration, poster, rate)
              VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [uuid, title, year, director, duration, poster, rate]
      )

      const genreIds = []
      for (const genreName of genreInput) {
        const genreQuery = await client.query(
          'SELECT id FROM genre WHERE LOWER(name) = LOWER($1)',
          [genreName]
        )
        if (genreQuery.length > 0) {
          genreIds.push(genreQuery[0].id)
        } else {
          console.error(`Genre '${genreName}' not found in the database.`)
        }
      }

      // Insertar los géneros en la tabla movie_genres
      for (const genreId of genreIds) {
        await client.query(
          'INSERT INTO movie_genres (movie_id, genre_id) VALUES ($1, $2)',
          [uuid, genreId]
        )
      }
    } catch (e) {
      console.error('Error creating movie:', e)
      throw new Error('Error creating movie')
    }

    const movie = await client.query(
      'SELECT * FROM movie WHERE id = $1',
      [uuid]
    )

    return movie
  }

  static async delete ({ id }) {
    try {
      // Eliminar las filas relacionadas en la tabla movie_genres
      await client.query(
        'DELETE FROM movie_genres WHERE movie_id = $1',
        [id]
      )

      // Luego eliminar la fila de la tabla movie
      const result = await client.query(
        'DELETE FROM movie WHERE id = $1',
        [id]
      )
      console.log(result.length)
      // Verificar si se eliminó con éxito la película
      const success = result.length > 0
      return success
    } catch (error) {
      console.error('Error deleting movie:', error)
      throw new Error('Error deleting movie')
    }
  }

  static async update ({ id, input }) {

  }
}
