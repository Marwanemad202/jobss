import path from 'node:path'
import * as dotenv from 'dotenv'
dotenv.config({ path: path.join("./src/config/.env.dev") })
import express from 'express'
import bootstrap from './src/app.controller.js'
const app = express()
const port = process.env.PORT || 8000


bootstrap(app, express)


app.listen(port, () => {
    console.log(`server is running on port ${port}!`)
})
