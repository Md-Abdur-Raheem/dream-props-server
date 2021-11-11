const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle wear
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aimii.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("DreamProps");
        const apartmentsCollection = database.collection("apartments");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");

        // api to get all apartments
        app.get('/allApartments', async (req, res) => {
            const cursor = apartmentsCollection.find({});
            const apartments = await cursor.toArray();
            res.json(apartments);
        })

        // api to get 6 apartments
        app.get('/apartments', async (req, res) => {
            const cursor = apartmentsCollection.find({}).limit(6);
            const apartments = await cursor.toArray();
            res.json(apartments);
        })

        //api to get appartments by id
        app.get('/appartments/:id', async (req, res) => {
            const id = req.params;
            const query = {_id: ObjectId(id)}
            const result = await apartmentsCollection.findOne(query);
            res.json(result);
        })

        //api to add user in the database
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //api to post users orders
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => res.send('Speaking form Dream Props : Hello world'));
app.listen(port, () => console.log("Running server on port", port))
