const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000


// middleware
app.use(cors({
    origin: ["http://localhost:5173", "https://tourism-management-4e4e3.web.app"]
}));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yq0oebc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const spotCollection = client.db('touristSpot').collection('spots');

        const countryCollection = client.db('countrySection').collection('country');





        app.get('/addSpot', async (req, res) => {
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/country', async (req, res) => {
            const cursor = countryCollection
                .find();
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/country/:countryName', async (req, res) => {
            const cursor = spotCollection.find({ CountryName: req.params.countryName });
            const result = await cursor.toArray();
            res.send(result)
        })


        app.post('/addSpot', async (req, res) => {
            console.log(req.body);
            const result = await spotCollection.insertOne(req.body);
            res.send(result)
        })

        app.get('/myList/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await spotCollection.find({ Email: req.params.email }).toArray();
            res.send(result)
        })


        app.get('/singleSpot/:id', async (req, res) => {
            console.log(req.params.id)
            const result = await spotCollection.findOne({ _id: new ObjectId(req.params.id) })
            console.log(result)
            res.send(result)
        })

        app.put('/updateSpot/:id', async (req, res) => {
            console.log(req.params.id)
            const query = { _id: new ObjectId(req.params.id) };
            const options = { upsert: true };
            const data = {
                $set: {
                    PhotoURL: req.body.PhotoURL,
                    AverageCost: req.body.AverageCost,
                    SpotName: req.body.SpotName,
                    TotalVisitor: req.body.TotalVisitor,
                    TravelTime: req.body.TravelTime,
                    Seasonality: req.body.Seasonality,
                    CountryName: req.body.CountryName,
                    Location: req.body.Location,
                    Description: req.body.Description,
                }
            }
            const result = await spotCollection.updateOne(query, data, options);
            console.log(result);
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const result = await spotCollection.deleteOne({ _id: new ObjectId(req.params.id) })
            console.log(result);
            res.send(result)
        })






        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('tourism-management-running')
})

app.listen(port, () => {
    console.log(`tourism-server running on port ${port}`)
})