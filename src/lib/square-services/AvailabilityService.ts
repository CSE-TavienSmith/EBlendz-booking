import { SquareService } from "./SquareService";

export type TimeSlot = {
    startAt: string; // ISO time from Square 
    teamMemberId: string; // which barber (needed to book later)
    serviceVersion: number; // whihc version of the service (needed to book later) 
};

export class AvailabilityService extends SquareService {
    async findSlots(ServiceId: string, days: number): Promise<TimeSlot[]> {
      const start = new Date(Date.now() + 60 * 60 * 1000);
      const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

      const result = await this.client.bookings.searchAvailability({
        query: {
            filter: {
                startAtRange: {
                    startAt: start.toISOString(),
                    endAt: end.toISOString(),
                },
                locationId: process.env.SQUARE_LOCATION_ID,
                segmentFilters: [{ serviceVariationId: ServiceId }],
            },
        },
      });

      return (result.availabilities ?? []).flatMap((slot): TimeSlot[] => {
        const segment = slot.appointmentSegments?.[0];
        if (!slot.startAt || !segment?.teamMemberId) return [];

        return [
          {
            startAt: slot.startAt,
            teamMemberId: segment.teamMemberId,
            serviceVersion: Number(segment.serviceVariationVersion ?? 0),
          },
        ];
      });
    }
} 