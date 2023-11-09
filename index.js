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
  const groups = chats
    .filter(
      chat =>
        chat.isGroup && chat.name.toLowerCase().includes('TARGET_GROUP_NAME')
    )
    .map(chat => {
      const MESSAGE = `Input your message here`
      return [new GroupChat(client, chat), MESSAGE]
    })

  groups.forEach(group => {
    const participants = group[0].participants

    participants.forEach(async (participant, idx) => {
      console.log('Participant' + idx)
      const contact = await client.getContactById(participant.id._serialized)
      const chat = await contact.getChat()

      const isNewChat = !chat?.lastMessage?.body?.length

      if (isNewChat || !chat) return
      console.log('Messaging participant' + idx)
      await chat.sendMessage(group[1])
    })
  })
})

client.initialize()
