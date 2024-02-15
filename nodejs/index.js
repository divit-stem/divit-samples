require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const { createServer } = require("http");

const { createDivitOrder } = require("./create-order/order");

const port = process.env.PORT || 8080;
const API_KEY = process.env.API_KEY;

app.use(express.json({ limit: "8mb" }));
app.use(cors());

const httpServer = createServer(app);
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/checkout", async (req, res) => {
  try {
    let params = req.body;
    let result = await createDivitOrder(
      `http://localhost:${port}`,
      API_KEY,
      params.orderType,
      params.firstname,
      params.lastname,
      params.email,
      params.phone,
      params.language,
      params.currency,
      params.itemType,
      params.orderTotal,
      params.items
    );

    return res.json({
      code: 200,
      message: "OK",
      data: result,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});
