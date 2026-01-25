import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import axios from "axios";

// 1. Define the Schema using Zod (Equivalent to Pydantic)
const PurchaseSchema = z.object({
  "merchant_id": z.string().describe("69755f6095150878eafeb984"),
  "medium": z.string().describe("balance"),
  "purchase_date": z.string().describe("Date of Purchase, i.e. 2026-01-24"),
  "amount": z.number().describe("Amount of Purchase, i.e. 7.52"),
  "status": z.string().describe("completed"),
  "description": z.string().describe("Category of purchase. Options: grocery, healthcare, dining, internet, merchandise, phone/cable")
});

const PurchaseListSchema = z.object({
  purchases: z.array(PurchaseSchema)
});

async function generateAndPostPurchases(account) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview", // Use a stable model version
  });

  // Fixed merchant_id from the Purchase Schema
  const MERCHANT_ID = "69755f6095150878eafeb984";
  const VALID_DESCRIPTIONS = ["grocery", "healthcare", "dining", "internet", "merchandise", "phone/cable"];
  const MEDIUM = "balance";
  
  const prompt = `Generate 10 realistic, diverse mock purchase transactions for a college student in the US. 
IMPORTANT CONSTRAINTS:
1. ALL purchases MUST use the exact merchant_id: "${MERCHANT_ID}". Do NOT generate or create any fake merchant IDs.
2. ALL purchases MUST have a description that is EXACTLY one of these categories (no variations, no alternatives): ${VALID_DESCRIPTIONS.join(", ")}
3. Make sure descriptions are varied and realistic but MUST match the given categories exactly.
4. Use the medium: "${MEDIUM}" for all transactions.`;

  try {
    // 2. Generate Content with JSON Constr aints
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }], 
      generationConfig: {
        responseMimeType: "application/json",
        // Pass the Zod-generated JSON schema
        responseSchema: {
          type: "object",
          properties: {
            purchases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  merchant_id: { type: "string", description: `Must be exactly: ${MERCHANT_ID}` },
                  medium: { type: "string" },
                  purchase_date: { type: "string" },
                  amount: { type: "number" },
                  status: { type: "string" },
                  description: { type: "string", enum: VALID_DESCRIPTIONS },
                },
                required: ["merchant_id", "medium", "purchase_date", "amount", "status", "description"]
              }
            }
          }
        }
      },
    });

    // 3. Parse and Validate (Equivalent to model_validate_json)
    const rawText = result.response.text();
    const mockData = PurchaseListSchema.parse(JSON.parse(rawText));

    // Validate and fix merchant_ids and descriptions
    for (const purchase of mockData.purchases) {
      if (purchase.merchant_id !== MERCHANT_ID) {
        console.warn(`⚠️  Warning: Merchant ID mismatch. Expected: ${MERCHANT_ID}, Got: ${purchase.merchant_id}`);
        purchase.merchant_id = MERCHANT_ID; // Force correct merchant_id
      }
      
      if (!VALID_DESCRIPTIONS.includes(purchase.description.toLowerCase())) {
        console.warn(`⚠️  Warning: Invalid description "${purchase.description}". Valid options: ${VALID_DESCRIPTIONS.join(", ")}`);
        // Replace with a matching category (try to find the closest match)
        purchase.description = VALID_DESCRIPTIONS[Math.floor(Math.random() * VALID_DESCRIPTIONS.length)];
      }
    }

    console.log("Generated Mock Purchases:", mockData);

    // 4. Post to Nessie API
    const nessieUrl = `http://api.nessieisreal.com/accounts/${account}/purchases?key=${process.env.NESSIE}`;

    for (const purchase of mockData.purchases) {
      try {
        const response = await axios.post(nessieUrl, purchase);

        if (response.status === 201) {
          console.log(`Created: ${purchase.description} for $${purchase.amount}`);
        }
      } catch (err) {
        console.error(`Error ${err.response?.status}: ${err.response?.data.objectCreated || err.message}`);
      }
    }
  } catch (error) {
    console.error("Failed to generate or validate data:", error);
  }
}

export { generateAndPostPurchases };