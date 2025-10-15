import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from "./routes.js"

dotenv.config()
const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000

app.use('/api', router);

app.listen(PORT, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on https://localhost:${PORT}`);
});

export default app