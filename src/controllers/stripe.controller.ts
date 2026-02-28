import { Request, Response } from "express";
import { stripe } from "../config";

export class StripeController {
  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const { mode, price_data, currency } = req.body;

      if (!mode || !["payment", "subscription"].includes(mode)) {
        return res.status(400).json({ error: "Invalid mode. Use 'payment' or 'subscription'." });
      }

      if (!price_data || !price_data.unit_amount || !price_data.name) {
        return res.status(400).json({ error: "Missing required price_data (unit_amount, name)." });
      }

      if (!currency) {
        return res.status(400).json({ error: "Missing required currency." });
      }

      const sessionData: any = {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: price_data.name,
              },
              unit_amount: price_data.unit_amount ?? 1,
            },
            quantity: 1,
          },
        ],
        mode: mode,
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      };

      if (mode === "subscription") {
        sessionData.line_items[0].price_data.recurring = { interval: "month" };
      }

      const session = await stripe.checkout.sessions.create(sessionData);

      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  }
}
