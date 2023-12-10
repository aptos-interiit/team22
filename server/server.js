const express = require('express')
const app = express()
const port = 4000
var cors = require('cors')
const {user_to_artist, update_timelistened} = require("./main")
const {test} = require("./test")

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    res.send("hello")
})
app.post('/user_to_artist', async (req, res) => {
    const {userAddress, artistAddresses, dist, amount} = req.body;
    const data = await user_to_artist(userAddress, artistAddresses, dist, amount);
    res.json({response: data})
})

app.post('/update_timelistened', async (req, res) => {
  const {songId, time} = req.body;
  const data = await update_timelistened(songId, time);
  res.json({response: data})
// res.send('Hello World!')
})

app.get('/test', (req, res) => {
  test();
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})