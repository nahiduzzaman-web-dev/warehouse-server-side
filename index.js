const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connection to cluster mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2n56y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const medicineCollection = client.db('warehouse').collection('medicine');

        // all api data load
        app.get('/medicine', async (req, res) => {
            const query = {};
            const cursor = medicineCollection.find(query);
            const medicines = await cursor.toArray();
            res.send(medicines);
        });

        // single dinamic data load
        app.get('/medicine/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const medicine = await medicineCollection.findOne(query);
            res.send(medicine);
        });

        // post (send data to server)
        app.post('/medicine', async (req, res) => {
            const newMedicine = req.body;
            const result = await medicineCollection.insertOne(newMedicine);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Warehouse server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});