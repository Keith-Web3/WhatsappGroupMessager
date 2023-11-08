const express = require('express')
const app = express()

const port = 3001

const { Client, LocalAuth, GroupChat } = require('whatsapp-web.js')

app.listen(port, () => {
  console.log(`Server listening on port::${port}`)
})

const MESSAGE = 'Testing whatsapp bot to message all group contacts'

const excludedGroups = [
  'csc year 1',
  '<javascript overload/>',
  'unilag balloting 101',
  'airlab unilag community',
  'jaja a006 (home of violence)',
  'devtown dl with python #1',
  'ejiro affiliate marketing webinar',
  '5 high income businesses masterclass in 2023🔥🔥',
  'gdsc mg flutter community',
  'cs announcements',
]

const client = new Client({
  puppeteer: {
    headless: false,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  },
  authStrategy: new LocalAuth({
    clientId: 'YOUR_CLIENT_ID',
  }),
})

client.on('qr', qr => {
  console.log('QR RECEIVED', qr)
})

client.on('ready', async () => {
  console.log('Client is ready!')
  const chats = await client.getChats()
  const groups = chats
    .filter(chat => chat.isGroup)
    .map(chat => {
      if (
        excludedGroups.some(groupName =>
          chat.name
            ?.toLowerCase()
            .trim()
            .includes(groupName.toLowerCase().trim())
        )
      )
        return null
      return new GroupChat(client, chat)
    })

  groups.forEach(group => {
    if (group === null) return
    const participants = group.participants

    participants.forEach(async participant => {
      const contact = await client.getContactById(participant.id._serialized)
      const chat = await contact.getChat()

      const isNewChat = !!chat?.lastMessage

      if (isNewChat || !chat) return
      await chat.sendMessage(MESSAGE)
    })
  })
})

client.initialize()
