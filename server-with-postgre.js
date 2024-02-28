import { createApp } from './app.js'
import { MovieModel } from './models/postgre/movie.js'

createApp({ movieModel: MovieModel })
