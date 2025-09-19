import express from "express";
import bodyParser from "body-parser";
import { Client, Environment } from "square";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // serve your HTML and assets

// Initialize Square client
const client = new Client({
  environment: Environment.Sandbox, // Change to Environment.Production in live
  accessToken: "REPLACE_WITH_YOUR_SECRET_ACCESS_TOKEN"
});

app.post("/process-payment", async (req, res) => {
  const { sourceId, amount } = req.body;

  try {
    const paymentsApi = client.paymentsApi;
    const response = await paymentsApi.createPayment({
      sourceId: sourceId,
      idempotencyKey: crypto.randomUUID(),
      amountMoney: {
        amount: amount, // in cents
        currency: "USD"
      }
    });
    res.json({ success: true, result: response.result });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
