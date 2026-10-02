import { randomUUID } from "crypto";
import { SquareService } from "./SquareService";

export class CustomerService extends SquareService {
  // Reuse the customer if this phone number already exists in Square
  async findOrCreate(name: string, phone: string, email?: string): Promise<string> {
    const found = await this.client.customers.search({
      query: { filter: { phoneNumber: { exact: phone } } },
    });
    const existingId = found.customers?.[0]?.id;
    if (existingId) return existingId;

    const [givenName, ...rest] = name.trim().split(/\s+/);
    const created = await this.client.customers.create({
      idempotencyKey: randomUUID(),
      givenName,
      familyName: rest.join(" ") || undefined,
      phoneNumber: phone,
      emailAddress: email || undefined,
    });

    if (!created.customer?.id) throw new Error("Square did not return a customer id");
    return created.customer.id;
  }
}