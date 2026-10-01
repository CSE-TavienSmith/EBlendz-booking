import "server-only";
import type { SquareClient } from "square";
import { getSquareClient } from "@/lib/square";

// Base class: every Square service shares one configured client
export abstract class SquareService {
    protected readonly client: SquareClient;

    constructor (client: SquareClient = getSquareClient()) {
        this.client = client;
    }
}