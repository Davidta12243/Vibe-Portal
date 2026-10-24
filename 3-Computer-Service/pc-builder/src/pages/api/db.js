const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://testingdb:testingdbPassword@cluster0.pjirtql.mongodb.net/pcbuilder";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run(req, res) {
  try {
    await client.connect();
    const productsCollection = client.db("pcbuilder").collection("products");

    if (req.method === "GET") {
      // Check if the request has a productId and/or a category in the query parameters
      const { productId, category } = req.query;

      if (productId) {
        // Fetch a single product by its id
        const product = await productsCollection.findOne({ id: productId });

        if (product) {
          // If the product is found, return it as JSON
          res
            .status(200)
            .json({ message: "Product retrieved successfully", product: product });
        } else {
          // If the product is not found, return an error response
          res.status(404).json({ message: "Product not found" });
        }
      } else if (category) {
        // Fetch products by category
        const productsByCategory = await productsCollection.find({ category }).toArray();

        if (productsByCategory.length > 0) {
          // If products are found for the category, return them as JSON
          res.status(200).json({ message: "Products retrieved successfully", products: productsByCategory });
        } else {
          // If no products are found for the category, return an error response
          res.status(404).json({ message: "No products found for the category" });
        }
      } else {
        // Fetch all products if neither productId nor category is provided
        const data = await productsCollection.find({}).toArray();
        res
          .status(200)
          .json({ message: "Products retrieved successfully", products: data });
      }
    }

    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error while fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Close the MongoDB connection
    client.close();
  }
}

export default run;
