import { SquareService } from "./SquareService";
import type { AppointmentType, Service } from "@/lib/services";

// Square category name -> our appointment type
const CATEGORY_TYPES: Record<string, AppointmentType> = {
  "Home Studio": "HOME_STUDIO",
  "Travel Cutz": "TRAVEL_CUTZ",
};

export class CatalogService extends SquareService {
  async listServices(): Promise<Service[]> {
    const result = await this.client.catalog.search({
      objectTypes: ["ITEM"],
      includeRelatedObjects: true,
    });

    // Category id -> category name
    const categoryNames = new Map<string, string>();
    for (const obj of result.relatedObjects ?? []) {
      if (obj.type === "CATEGORY" && obj.id && obj.categoryData?.name) {
        categoryNames.set(obj.id, obj.categoryData.name);
      }
    }

    const services = (result.objects ?? []).flatMap((obj): Service[] => {
      if (obj.type !== "ITEM") return [];
      if (obj.itemData?.productType !== "APPOINTMENTS_SERVICE") return [];

      const variation = obj.itemData.variations?.[0];
      if (variation?.type !== "ITEM_VARIATION") return [];
      const data = variation.itemVariationData;
      if (!data?.availableForBooking) return [];

      const categoryId = obj.itemData.reportingCategory?.id ?? "";
      const type = CATEGORY_TYPES[categoryNames.get(categoryId) ?? ""];
      if (!type) return [];

      return [
        {
          id: variation.id,
          name: obj.itemData.name ?? "Service",
          durationMinutes: Number(data.serviceDuration ?? 0) / 60000,
          priceCents: Number(data.priceMoney?.amount ?? 0),
          type,
        },
      ];
    });

    // Cheapest first
    return services.sort((a, b) => a.priceCents - b.priceCents);
  }
}