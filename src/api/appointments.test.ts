import {
  APPOINTMENT_DURATION_MINUTES,
  APPOINTMENT_CLOSING_MINUTES,
  APPOINTMENT_OPENING_MINUTES,
  APPOINTMENT_SLOT_MINUTES,
  APPOINTMENT_TIME_SLOTS,
  formatAppointmentTime,
  isAppointmentTimeSlotUnavailable,
} from "./appointments";

test("provides 30-minute start times through 10:30 PM", () => {
  expect(APPOINTMENT_SLOT_MINUTES).toBe(30);
  expect(APPOINTMENT_DURATION_MINUTES).toBe(30);
  expect(APPOINTMENT_TIME_SLOTS[0]).toBe(APPOINTMENT_OPENING_MINUTES);
  expect(APPOINTMENT_TIME_SLOTS[APPOINTMENT_TIME_SLOTS.length - 1]).toBe(
    22 * 60 + 30,
  );
  expect(APPOINTMENT_TIME_SLOTS).toHaveLength(28);
  expect(formatAppointmentTime(9 * 60 + 30)).toBe("9:30 AM");
  expect(formatAppointmentTime(22 * 60 + 30)).toBe("10:30 PM");
});

test("allows a 30-minute slot to end at 11 PM but not later", () => {
  const appointments: Parameters<typeof isAppointmentTimeSlotUnavailable>[2] =
    [];

  expect(
    isAppointmentTimeSlotUnavailable(
      APPOINTMENT_CLOSING_MINUTES - APPOINTMENT_SLOT_MINUTES,
      APPOINTMENT_SLOT_MINUTES,
      appointments,
    ),
  ).toBe(false);
  expect(
    isAppointmentTimeSlotUnavailable(
      APPOINTMENT_CLOSING_MINUTES - APPOINTMENT_SLOT_MINUTES,
      APPOINTMENT_SLOT_MINUTES + 1,
      appointments,
    ),
  ).toBe(true);
});
