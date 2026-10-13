import { apiRequest } from "./services";

export type CustomerInput = {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
};

export type Customer = CustomerInput & {
  id: number;
  active?: boolean;
};

export type AppointmentItem = {
  id: number;
  subServiceId: number;
  serviceName: string;
  subServiceName: string;
  unitPrice: number;
  durationMinutes: number;
  quantity: number;
  totalPrice: number;
};

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type AppointmentStatusValue = AppointmentStatus | number | string;

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];

export function normalizeAppointmentStatus(
  status: AppointmentStatusValue,
): AppointmentStatus | undefined {
  if (typeof status === "number") {
    return Number.isInteger(status) ? APPOINTMENT_STATUSES[status] : undefined;
  }

  const normalized = status.trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (/^\d+$/.test(normalized)) {
    return APPOINTMENT_STATUSES[Number(normalized)];
  }
  return APPOINTMENT_STATUSES.find((knownStatus) => knownStatus === normalized);
}

export const APPOINTMENT_SLOT_MINUTES = 60;
export const APPOINTMENT_OPENING_MINUTES = 9 * 60;
export const APPOINTMENT_CLOSING_MINUTES = 22 * 60;
export const APPOINTMENT_TIME_SLOTS = Array.from(
  {
    length:
      (APPOINTMENT_CLOSING_MINUTES - APPOINTMENT_OPENING_MINUTES) /
      APPOINTMENT_SLOT_MINUTES,
  },
  (_, index) =>
    APPOINTMENT_OPENING_MINUTES + index * APPOINTMENT_SLOT_MINUTES,
);

export function appointmentTimeToMinutes(value?: string): number | undefined {
  const match = value?.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return undefined;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return undefined;
  return hours * 60 + minutes;
}

export function formatAppointmentTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${hours % 12 || 12}:00 ${hours >= 12 ? "PM" : "AM"}`;
}

export function isAppointmentTimeSlotInPast(
  appointmentDate: string,
  slotStart: number,
  now = new Date(),
): boolean {
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  return (
    appointmentDate < today ||
    (appointmentDate === today &&
      slotStart <= now.getHours() * 60 + now.getMinutes())
  );
}

export function isValidPhoneNumber(value: string): boolean {
  const phone = value.trim();
  const digitCount = phone.replace(/\D/g, "").length;
  return /^\+?[\d\s().-]+$/.test(phone) && digitCount >= 7 && digitCount <= 15;
}

export type Appointment = {
  id: number;
  customerId?: number;
  customerName?: string;
  customer?: Customer;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subServiceIds?: number[];
  items?: AppointmentItem[];
  appointmentDate: string;
  preferredStartTime?: string;
  startTime?: string;
  endTime?: string;
  status: AppointmentStatusValue;
  notes?: string | null;
  totalAmount?: number;
  totalDurationMinutes?: number;
  subtotal?: number;
  discount?: number;
  paymentStatus?: string;
};

export function isAppointmentTimeSlotUnavailable(
  slotStart: number,
  appointmentDurationMinutes: number,
  appointments: Appointment[],
): boolean {
  const slotEnd = slotStart + appointmentDurationMinutes;
  if (slotEnd > APPOINTMENT_CLOSING_MINUTES) return true;

  return appointments.some((appointment) => {
    const status = normalizeAppointmentStatus(appointment.status);
    if (
      status === "CANCELLED" ||
      status === "COMPLETED" ||
      status === "NO_SHOW"
    ) {
      return false;
    }

    const existingStart = appointmentTimeToMinutes(
      appointment.startTime ?? appointment.preferredStartTime,
    );
    if (existingStart === undefined) return false;

    const explicitEnd = appointmentTimeToMinutes(appointment.endTime);
    const existingDuration =
      appointment.totalDurationMinutes ??
      appointment.items?.reduce(
        (total, item) => total + item.durationMinutes * item.quantity,
        0,
      ) ??
      APPOINTMENT_SLOT_MINUTES;
    const existingEnd =
      explicitEnd !== undefined && explicitEnd > existingStart
        ? explicitEnd
        : existingStart +
          Math.max(existingDuration, APPOINTMENT_SLOT_MINUTES);

    return slotStart < existingEnd && slotEnd > existingStart;
  });
}

export type CreateAppointmentInput = {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  subServiceIds: number[];
  appointmentDate: string;
  preferredStartTime: string;
  notes?: string;
};

export const appointmentApi = {
  create: (input: CreateAppointmentInput) =>
    apiRequest<Appointment>(
      "/api/appointments",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      { allowRawObject: true },
    ),

  get: (appointmentId: number) =>
    apiRequest<Appointment>(
      `/api/appointments/${appointmentId}`,
      {},
      { allowRawObject: true },
    ),

  byCustomer: (customerId: number) =>
    apiRequest<Appointment[]>(
      `/api/appointments/customer/${customerId}`,
      {},
      { allowRawArray: true },
    ),

  byDate: (date: string, signal?: AbortSignal) =>
    apiRequest<Appointment[]>(
      `/api/appointments/date/${encodeURIComponent(date)}`,
      { signal },
      { allowRawArray: true },
    ),

  cancel: (appointmentId: number) =>
    apiRequest<void>(`/api/appointments/${appointmentId}/cancel`, {
      method: "PATCH",
    }),

  updateStatus: (appointmentId: number, status: AppointmentStatus) =>
    apiRequest<Appointment>(
      `/api/appointments/${appointmentId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(status),
      },
      { allowRawObject: true },
    ),
};
