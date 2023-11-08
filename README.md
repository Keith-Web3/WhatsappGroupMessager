# WhatsappGroupMessager

A quick project for a friend.

## Getting Started

Follow these steps to set up and run the chatbot on your local machine:

1. **Fork the Repository**: Start by forking this repository to your own GitHub account by clicking the "Fork" button in the upper right corner.

2. **Clone the Repository**: Clone your forked repository to your local machine using Git. Replace `<your-username>` with your GitHub username.

```bash
git clone https://github.com/<your-username>/WhatsappGroupMessager.git
```

3. Navigate to the project's directory
```bash
  cd WhatsappGroupMessager
```
4. Install the project's dependencies
```bash
npm install
```
5. Change the MESSAGE variable in `index.js` to your desired message.
```bash
const MESSAGE = <"YOUR MESSAGE">
```
6. **Run the Chatbot**: Start the chatbot by running the following command:
```bash
node index.js
```
7. **Scan the QR Code**: The chatbot will generate a QR code. Scan this code with your WhatsApp mobile app to link your WhatsApp account with the chatbot.

8. **Wait for the Bot to Start**: After scanning the QR code, the chatbot will begin running and performing its tasks in your WhatsApp groups.
