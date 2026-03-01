import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { prisma } from './prisma'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())

// Middleware to get user id from header
app.use((req, res, next) => {
  const userId = req.headers['x-user-id'] || 'default-user'
  req.userId = userId as string
  next()
})

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

// Home route - HTML
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// --- Mind-Matters API Routes ---

// User Profile
app.get('/profile', async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId }
    })
    res.json(profile?.data || {})
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

app.post('/profile', async (req, res) => {
  try {
    const profile = await prisma.profile.upsert({
      where: { userId: req.userId },
      update: { data: req.body },
      create: { userId: req.userId, data: req.body }
    })
    res.json(profile.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Mood Tracking
app.get('/mood', async (req, res) => {
  try {
    const moods = await prisma.mood.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(moods.map(m => m.data))
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch moods' })
  }
})

app.post('/mood', async (req, res) => {
  try {
    const mood = await prisma.mood.create({
      data: {
        userId: req.userId,
        data: req.body
      }
    })
    res.json(mood.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to log mood' })
  }
})

// Journaling
app.get('/journal', async (req, res) => {
  try {
    const journals = await prisma.journal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    })
    res.json(journals.map(j => j.data))
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journals' })
  }
})

app.post('/journal', async (req, res) => {
  try {
    const journal = await prisma.journal.create({
      data: {
        userId: req.userId,
        data: req.body
      }
    })
    res.json(journal.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journal entry' })
  }
})

// Stress Management
app.get('/stress/kit', async (req, res) => {
  try {
    const kit = await prisma.stressKit.findUnique({
      where: { userId: req.userId }
    })
    res.json(kit?.data || {})
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stress kit' })
  }
})

app.put('/stress/kit', async (req, res) => {
  try {
    const kit = await prisma.stressKit.upsert({
      where: { userId: req.userId },
      update: { data: req.body },
      create: { userId: req.userId, data: req.body }
    })
    res.json(kit.data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stress kit' })
  }
})

// Chat & AI
app.post('/chat', async (req, res) => {
  const { issueTitle, issueTags, messages } = req.body
  const issueKey = issueTitle.toLowerCase().replace(/\s+/g, '-')

  try {
    const chat = await prisma.chatHistory.upsert({
      where: {
        userId_issueKey: {
          userId: req.userId,
          issueKey
        }
      },
      update: {
        messages: messages // In a real app, we might append
      },
      create: {
        userId: req.userId,
        issueKey,
        messages: messages
      }
    })
    // Mock AI response
    const aiResponse = {
      sender: 'ai',
      text: "I understand you're feeling this way. Let's talk about it."
    }
    const updatedMessages = [...(chat.messages as any[]), aiResponse]

    await prisma.chatHistory.update({
      where: { id: chat.id },
      data: { messages: updatedMessages }
    })

    res.json({
      issueTitle,
      issueTags,
      messages: updatedMessages
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat' })
  }
})

app.get('/chat/history/:issueKey', async (req, res) => {
  try {
    const chat = await prisma.chatHistory.findUnique({
      where: {
        userId_issueKey: {
          userId: req.userId,
          issueKey: req.params.issueKey
        }
      }
    })
    res.json(chat || {})
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' })
  }
})

// Payments
app.post('/create-checkout-session', async (req, res) => {
  // Mock checkout session
  res.json({
    id: 'cs_test_' + Math.random().toString(36).substr(2, 9),
    url: 'https://checkout.stripe.com/pay/mock'
  })
})

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
