const express = require('express')
const app = express()

const port = 3001

const { Client, LocalAuth, GroupChat } = require('whatsapp-web.js')

app.listen(port, () => {
  console.log(`Server listening on port::${port}`)
})

const MESSAGE = 'Testing whatsapp bot to message all group contacts'

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
    .map(chat => new GroupChat(client, chat))

  groups.forEach(group => {
    const participants = group.participants

    participants.forEach(async participant => {
      console.log(participant)
      const contact = await client.getContactById(participant.id._serialized)
      const chat = await contact.getChat()

      const isNewChat = !!chat?.lastMessage

      if (isNewChat || !chat) return
      await chat.sendMessage(MESSAGE)
    })
  })
})

client.initialize()
