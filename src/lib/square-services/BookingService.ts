import { SquareService } from "./SquareService";
import type { TimeSlot } from "./AvailabilityService";

type NewBooking = {
  slot: TimeSlot;
  serviceId: string;
  durationMinutes: number;
  customerId: string;
  note: string;
  idempotencyKey: string;
};

export class BookingService extends SquareService {
  async create(input: NewBooking): Promise<string> {
    const result = await this.client.bookings.create({
      idempotencyKey: input.idempotencyKey,
      booking: {
        startAt: input.slot.startAt,
        locationId: process.env.SQUARE_LOCATION_ID,
        customerId: input.customerId,
        customerNote: input.note || undefined,
        appointmentSegments: [
          {
            serviceVariationId: input.serviceId,
            serviceVariationVersion: BigInt(input.slot.serviceVersion),
            teamMemberId: input.slot.teamMemberId,
            durationMinutes: input.durationMinutes,
          },
        ],
      },
    });

    if (!result.booking?.id) throw new Error("Square did not return a booking id");
    return result.booking.id;
  }
}