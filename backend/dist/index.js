import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;
app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});
app.listen(PORT, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${PORT}`);
});
