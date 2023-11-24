const express = require('express')
const app = express()

const port = 3001

const { Client, LocalAuth, GroupChat } = require('whatsapp-web.js')

app.listen(port, () => {
  console.log(`Server listening on port::${port}`)
})

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
  const chat = chats.find(
    chat =>
      chat.isGroup &&
      chat.name?.toLowerCase().includes('scientists arena brainstorm')
  )

  const MESSAGE = `Hey 👋, it's Mide!.\nI'm Connecting with many people and would love to connect with you too. Got your contact from ${chat.name}. Let's build a network of friends focused on sharing meaningful values.\nSave my number as "Mide" and send me your name so I can save yours. 😇`
  const group = [new GroupChat(client, chat), MESSAGE]

  console.log(group)

  const participants = group[0].participants

  participants.forEach(async (participant, idx) => {
    console.log('Participant' + idx)
    const contact = await client.getContactById(participant.id._serialized)
    const chat = await contact.getChat()

    console.log(chat?.lastMessage === undefined ? 'newContact' : 'old contact')

    const isNewChat = chat?.lastMessage === undefined

    if (!isNewChat || !chat) return
    console.log('Messaging participant' + idx)
    await chat.sendMessage(group[1])
  })
})

client.initialize()
