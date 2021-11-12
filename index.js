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
        const reviewsCollection = database.collection("reviews");

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

        //api to get specific users orders
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const result = await ordersCollection.find(filter).toArray();
            res.json(result);
        })

        //api to delete users order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        //api to add review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        })

        //api to get all reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        //api to make admin
        app.put('/users', async (req, res) => {
            const email = req.body.email;
            const user = await usersCollection.findOne({ email: email });
            // user.role = "Admin";
            const updateDoc = { $set: {role:"Admin"} };
            const result = await usersCollection.updateOne(user, updateDoc);
            res.json(result);
        })

        //api to get all admin
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({ role: 'Admin' });
            const result = await cursor.toArray();
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
