const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = 'TELEGRAM_BOT_TOKEN';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: './data.csv',
    header: [
        {id: 'Sender', title: 'Sender'},
        {id: 'Reciever', title: 'Reciever'},
        {id: 'Token', title: 'Token'},
        {id: 'Value', title: 'Value'},
        {id: 'Txn', title: 'Txn'},
        {id: 'Time', title: 'Time'},
    ]
});
 
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.on('channel_post', (msg) => {
  try {
  if (!msg.text) {
    return;
  }

  const data = /🏦 🤖 (.*) sent ([0-9,.]*) (.*) \(\$([0-9,.]*).*🤖 (.*)\(/g.exec(msg.text);
  const txn = msg.entities[msg.entities.length - 1].url;

  const result = {
    Sender: data[1],
    Reciever: data[5],
    Token: data[3],
    Value: +data[4].replace(',', ''),
    Txn: txn,
    Time: new Date().toString()
  }

  /**
   * FIXME:
   * - This function is async, so if we receive too much message in the same time, the data will be occorre
   * - Using a queue or something else for delay action interact with csv file
   */
  csvWriter.writeRecords([result]) 
  
  console.log(result)
  } catch (error) {
  }
})
