// API routes for managing favorite players
import express from 'express'
const router = express.Router()

// Set this to match the model name in your Prisma schema
const model = 'item'

// Import and initialize the Prisma client
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Connect to the database
prisma.$connect().then(() => {
    console.log('Prisma connected to MongoDB')
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err)
})

// ----- Toggle Player (Add/Remove from Favorites) -----
router.post('/data', async (req, res) => {
    try {
        const { id, data } = req.body

        if (!id || !data) {
            return res.status(400).send({ error: 'Invalid player data. Must include id and data.' })
        }

        // Check if this player already exists in favorites
        const existing = await prisma[model].findFirst({
            where: {
                id: id.toString()
            }
        })

        let action, item
        if (existing) {
            // Already in favorites, so remove it
            item = await prisma[model].delete({
                where: { id: existing.id }
            })
            action = 'removed'
        } else {
            // Not in favorites, so add it
            item = await prisma[model].create({
                data: {
                    id: id.toString(),
                    data: data
                }
            })
            action = 'added'
        }

        res.status(action === 'added' ? 201 : 200).send({
            action,
            item
        })

    } catch (err) {
        console.error('POST /data error:', err)
        res.status(500).send({ error: 'Failed to toggle player', details: err.message || err })
    }
})

// ----- READ (GET) all favorite players ----- 
router.get('/data', async (req, res) => {
    try {
        const items = await prisma[model].findMany({
            orderBy: { id: 'asc' }
        })

        res.send(items)
    } catch (err) {
        console.error('GET /data error:', err)
        res.status(500).send({ error: 'Failed to fetch players', details: err.message || err })
    }
})

// ----- READ (GET) single player by ID ----- 
router.get('/data/:playerId', async (req, res) => {
    try {
        const playerId = req.params.playerId

        const item = await prisma[model].findUnique({
            where: {
                id: playerId
            }
        })

        res.send({
            exists: !!item,
            item: item || null
        })

    } catch (err) {
        console.error('GET /data/:playerId error:', err)
        res.status(500).send({ error: 'Failed to fetch player', details: err.message || err })
    }
})

export default router