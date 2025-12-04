// Express server for Football API app
import express from 'express'
const app = express()

// Serve static files from /public folder
app.use(express.static('public'))
// Define index.html as the root explicitly
app.get('/', (req, res) => { res.redirect('/index.html') })

// Enable express to parse JSON data with increased size limit
app.use(express.json({ limit: '1mb' }))

// Import and activate API routes
import apiRoutes from './routes/api.js'
app.use('/', apiRoutes)

const port = 3003
app.listen(port, () => {
    console.log(`Express is live at http://localhost:${port}`)
})