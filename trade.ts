import { KiteConnect } from "kiteconnect";

const apiKey = process.env.ZERODHA_API_KEY || "your_api_key_here";
const apiSecret = process.env.ZERODHA_API_SECRET || "your_api_secret_here";
const requestToken =
  process.env.ZERODHA_REQUEST_TOKEN || "your_api_secret_here";
const access_token =
  process.env.ZERODHA_ACCESS_TOKEN || "your_access_token_here";

const kc = new KiteConnect({ api_key: apiKey });
kc.setAccessToken(access_token);

export async function placeOrder(
  tradingsymbol: string,
  transaction_type: "BUY" | "SELL",
  quantity: number
) {
  try {
    const response = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol, //UNIONBANK
      transaction_type,
      quantity,
      product: "CNC",
      order_type: "MARKET",
    });
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function generateSession() {
  try {
    console.log("login", kc.getLoginURL());

    const response = await kc.generateSession(requestToken, apiSecret);
    console.log("access token:", response);

    let accessToken = response.access_token;
    kc.setAccessToken(accessToken);
    console.log("Session generated successfully");
  } catch (err) {
    console.error("Error generating session:", err);
  }
}

export async function getAllHoldings() {
  const holdings = await kc.getHoldings();
  let allHoldings = "";
  holdings.map((holding) => {
    allHoldings += `Symbol: ${holding.tradingsymbol}, Quantity: ${holding.quantity}, Price: ₹${holding.last_price}\n`;
  });

  return allHoldings || "No holdings found.";
}
