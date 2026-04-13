import { generateAppIdeas } from "./app-ideas";
import { findClickBankProducts } from "./clickbank";

export async function runDiscover(userId: string): Promise<void> {
  console.log(`Starting discover for user ${userId}...`);

  try {
    await generateAppIdeas(userId);
  } catch (error) {
    console.error("Error generating app ideas:", error);
  }

  try {
    await findClickBankProducts(userId);
  } catch (error) {
    console.error("Error finding ClickBank products:", error);
  }

  console.log(`Discover completed for user ${userId}`);
}
