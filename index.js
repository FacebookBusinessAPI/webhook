const express = require('express')
const body_parser = require('body-parser')
const axios = require('axios')


const app = express().use(body_parser.json())
const port = process.env.PORT || 8000
const my_token = process.env.MYTOKEN
const API_token = process.env.API_TOKEN


app.get('/', (req, res) => {
  res.send('Webhook')
})
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode']
  let challenge = req.query['hub.challenge']
  let token = req.query['hub.verify_token']

  if (mode && token) {
    if (mode === 'subscribe' && token === my_token) {
      res.status(200).send(challenge)
    } else {
      res.status(403)
    }
  } else {
    res.status(403)
  }
})

app.post('/webhook', async (req, res) => {
  let bodyMess = req.body
  console.log(JSON.stringify(bodyMess, null, 2))
  if (bodyMess.object) {
    console.log("bodyMess if in :-" , bodyMess);
    if (
      bodyMess.entry &&
      bodyMess.entry[0].changes &&
      bodyMess.entry[0].changes[0].value.messages &&
      bodyMess.entry[0].changes[0].value.messages[0]
    ) {
       let phone_number_id = bodyMess.entry[0].changes[0].value.metadata.phone_number_id;
       let from = bodyMess.entry[0].changes[0].value.messages[0].from;
       let mess = bodyMess.entry[0].changes[0].value.messages[0].text.body;
       
       console.log("phone_number_id" , phone_number_id)
       console.log("from" , from)
       console.log("mess" , mess)




       const data = {
        messaging_product: 'whatsapp',
        to: from,
        text: {
          body: "welcom to DIGI3",
        },
       }

       const config ={
        method:"POST",
        url:`https://graph.facebook.com/v15.0/${phone_number_id}/messages?access_token=${API_token}`,
        data:data,
        headers:{
            "Content-Type": "application/json"
        }
       }
       await axios(config)
       .then((respons)=>{
        console.log("respons",JSON.stringify(respons));
       }).catch((err)=>{
        console.log("err",err);
       })
       res.sendStatus(200)
    }else{
       res.sendStatus(403)
    }
  }else{
    res.sendStatus(403)
 }
})

app.listen(port, () => {
  console.log('webhook is listening on srver')
})
