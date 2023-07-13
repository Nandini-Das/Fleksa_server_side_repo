const express = require('express');

const app = express();


const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');
const uri = "mongodb+srv://OnlineFood_WEB:lYOkvIcDNYqze46i@cluster0.qhdslp1.mongodb.net/?retryWrites=true&w=majority";

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
    
  
    // Send a ping to confirm a successful connection
    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const menuCollections = client.db('OnlineFood_WEB').collection('MenuCollection');
    const orderCollections = client.db('OnlineFood_WEB').collection('OrderCollection');
    app.get('/menu', async (req, res) => {
        try {
    
          const products = await menuCollections.find().toArray();
          res.json(products);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve products' });
        }
      });
     
      app.get('/myOrder', async (req, res) => {
        try {
    
          const products = await orderCollections.find().toArray();
          res.json(products);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to retrieve products' });
        }
      });


app.get('/menu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await menuCollections.findOne({ _id: new ObjectId(id) });

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve menu item' });
  }
});
app.post('/orderedItem', async (req, res) => {
    const newItem = req.body;
  
    try {
      const insertedProduct = await orderCollections.insertOne(newItem);
      if (insertedProduct && insertedProduct.insertedId) {
        res.json({ message: 'Product added successfully' });
      } else {
        res.status(500).json({ message: 'Failed to add product' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ message: 'Failed to add product' });
    }
  });



// ...

  } 
  
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running')
  })
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })