import React, { useEffect, useState } from "react";
import "./CustomerPages.css";
import PublicEditorialHero from "../components/common/PublicEditorialHero";
import BrandLoader from "../components/common/BrandLoader";
import "./AppointmentsPage.css";
import useServices from "../api/useServices";
import {
  ApiService,
  ApiSubService,
  formatPrice,
} from "../api/services";
import {
  APPOINTMENT_CLOSING_MINUTES,
  APPOINTMENT_SLOT_MINUTES,
  APPOINTMENT_TIME_SLOTS,
  appointmentApi,
  Appointment,
  appointmentTimeToMinutes,
  formatAppointmentTime,
  isValidPhoneNumber,
  isAppointmentTimeSlotUnavailable,
} from "../api/appointments";
type Props = { navigate: (to: string) => void };
type SelectedService = {
  categoryId: number;
  categoryTitle: string;
  subServiceId: number;
  name: string;
  price: number;
  originalPrice: number;
  durationMinutes: number;
};

function serviceCategoryIcon(service: ApiService): string {
  const label = service.name.toLowerCase();
  if (label.includes("nail") || label.includes("hand") || label.includes("foot"))
    return "❀";
  if (label.includes("hair")) return "〰";
  if (label.includes("facial") || label.includes("skin")) return "◉";
  if (label.includes("wax") || label.includes("thread")) return "✧";
  if (label.includes("mehndi") || label.includes("henna")) return "❋";
  if (label.includes("makeup") || label.includes("make over")) return "✦";

  const icon = service.icon.trim();
  return Array.from(icon).length <= 2 ? icon : "✦";
}

function SelectedServicesSummary({
  services,
  onRemove,
}: {
  services: SelectedService[];
  onRemove?: (service: SelectedService) => void;
}) {
  const estimatedTotal = services.reduce(
    (sum, service) => sum + service.price,
    0,
  );
  const estimatedDuration = services.reduce(
    (sum, service) => sum + service.durationMinutes,
    0,
  );

  return (
    <section className="selected-services" aria-label="Selected treatments">
      <div className="selected-services-heading">
        <span className="selected-services-label">Selected treatments</span>
        <span>{services.length} selected</span>
      </div>
      <ul className="selected-service-list">
        {services.map((service) => (
          <li
            className="selected-service-row"
            key={`${service.categoryId}-${service.name}`}
          >
            <span className="selected-service-details">
              <small>{service.categoryTitle}</small>
              <span>{service.name}</span>
            </span>
            <strong className="selected-service-price">
              {service.originalPrice !== service.price && (
                <del>{formatPrice(service.originalPrice)}</del>
              )}
              <span>{formatPrice(service.price)}</span>
            </strong>
            {onRemove && (
              <button
                type="button"
                aria-label={`Remove ${service.name}`}
                onClick={() => onRemove(service)}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="selected-services-total">
        <span>Estimated menu total</span>
        <strong>{formatPrice(estimatedTotal)}</strong>
        <small>
          {estimatedDuration
            ? `${estimatedDuration} minutes · `
            : ""}
          Final price and availability are confirmed by the salon.
        </small>
      </div>
    </section>
  );
}

export default function AppointmentsPage({ navigate }: Props) {
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    reload: reloadServices,
  } = useServices();
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    [],
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [availabilityReload, setAvailabilityReload] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const done = appointment !== null;
  const today = new Date();
  const todayDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const selectedIds = selectedServices
    .map((service) => service.subServiceId)
    .sort((a, b) => a - b);
  const selectedDurationMinutes = Math.max(
    APPOINTMENT_SLOT_MINUTES,
    selectedServices.reduce((total, service) => total + service.durationMinutes, 0),
  );

  useEffect(() => {
    if (!date || step !== 2) return;
    const controller = new AbortController();
    setAvailabilityLoading(true);
    setAvailabilityError("");
    setDayAppointments([]);
    appointmentApi
      .byDate(date, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setDayAppointments(items);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setAvailabilityError(
            error instanceof Error
              ? error.message
              : "Could not check appointment availability.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setAvailabilityLoading(false);
      });
    return () => controller.abort();
  }, [date, step, availabilityReload]);

  const isSlotUnavailable = (slotStart: number) => {
    return isAppointmentTimeSlotUnavailable(
      slotStart,
      selectedDurationMinutes,
      dayAppointments,
    );
  };

  const formatTime = (value: string) => {
    const [hourValue, minute = "00"] = value.split(":");
    const hour = Number(hourValue);
    if (Number.isNaN(hour)) return value;
    return `${hour % 12 || 12}:${minute.slice(0, 2)} ${hour >= 12 ? "PM" : "AM"}`;
  };
  const selectedDateLabel = date
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(`${date}T00:00:00`))
    : "";
  const activeServices = services.filter((service) => service.active);
  const toggleService = (category: ApiService, item: ApiSubService) => {
    setSelectedServices((current) =>
      current.some((selected) => selected.subServiceId === item.id)
        ? current.filter((selected) => selected.subServiceId !== item.id)
        : [
            ...current,
            {
              categoryId: category.id,
              categoryTitle: category.name,
              subServiceId: item.id,
              name: item.name,
              price: item.offerPrice ?? item.price,
              originalPrice: item.price,
              durationMinutes: item.durationMinutes,
            },
          ],
    );
  };
  const removeSelectedService = (service: SelectedService) => {
    setSelectedServices((current) =>
      current.filter(
        (selected) => selected.subServiceId !== service.subServiceId,
      ),
    );
  };
  const next = async () => {
    if (step === 1 && selectedServices.length === 0) {
      setBookingError("Select at least one treatment to continue.");
      return;
    }
    if (step === 2 && (!date || !time)) {
      setBookingError("Choose a date and available start time to continue.");
      return;
    }
    if (step === 2 && date < todayDate) {
      setBookingError("Choose today or a future date.");
      return;
    }
    if (
      step === 2 &&
      (availabilityLoading ||
        Boolean(availabilityError) ||
        isSlotUnavailable(appointmentTimeToMinutes(time) ?? -1))
    ) {
      setBookingError(
        availabilityError ||
          "That time is unavailable. Please choose another appointment slot.",
      );
      return;
    }
    if (step === 3) {
      if (!name.trim()) {
        setBookingError("Enter your name to continue.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setBookingError("Enter a valid email address.");
        return;
      }
      if (!isValidPhoneNumber(phone)) {
        setBookingError("Enter a valid phone number.");
        return;
      }
    }
    setBookingError("");
    if (step < 3) setStep(step + 1);
    else {
      setSubmitting(true);
      setBookingError("");
      try {
        const nameParts = name.trim().split(/\s+/);
        const created = await appointmentApi.create({
          firstName: nameParts[0],
          ...(nameParts.length > 1
            ? { lastName: nameParts.slice(1).join(" ") }
            : {}),
          email: email.trim(),
          phone: phone.trim(),
          subServiceIds: selectedIds,
          appointmentDate: date,
          preferredStartTime: time,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        });
        setAppointment(created);
      } catch (error) {
        setBookingError(
          error instanceof Error
            ? error.message
            : "We couldn’t book your appointment. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    }
  };
  return (
    <main className="customer-page booking-page">
      <PublicEditorialHero
        className="appointment-hero"
        kicker="A LITTLE TIME FOR YOU"
        title={
          done ? (
            "You’re on our calendar."
          ) : (
            <>
              Let’s find your <em>moment.</em>
            </>
          )
        }
        description={
          done
            ? "Your appointment request has been sent to the salon. We can’t wait to see you."
            : "A few little details and your chair will be waiting."
        }
        image="/images/janvi-bridal-finish.jpeg"
        imageAlt="Janvi finishing a bridal makeup look"
        secondaryImage="/images/janvi-makeup-portrait.jpeg"
        secondaryImageAlt="A finished makeup look by Janvi"
        secondaryCaption="Your look, your way"
        caption="Your moment, just for you"
        index="04"
        imageLabel="YOUR VISIT"
        note={
          <>
            Make time <i>·</i> for you
          </>
        }
        actionLabel={done ? "Back to the studio" : "Choose your service"}
        onAction={() =>
          done
            ? navigate("/")
            : document
                .getElementById("booking-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      />
      {done ? (
        <section className="booking-success">
          <span className="success-mark">✳</span>
          <h2>We can’t wait to see you, {name.split(" ")[0]}.</h2>
          <SelectedServicesSummary
            services={selectedServices}
          />
          <p>
            {appointment?.appointmentDate ?? date} ·{" "}
            {formatTime(
              appointment?.startTime ??
                time,
            )}
            {appointment?.id ? ` · Booking #${appointment.id}` : ""}
          </p>
          <button className="underlined-link" onClick={() => navigate("/")}>
            Back to the studio <span>↗</span>
          </button>
        </section>
      ) : (
        <section className="booking-section" id="booking-form">
          <div className="booking-section-intro">
            <span className="page-kicker">YOUR VISIT, YOUR WAY</span>
            <h2>Plan a little time for you.</h2>
            <p>Choose what you’d like, then find a time that works.</p>
          </div>
          <div className="booking-layout">
            <section className="booking-form-card">
              <div className="booking-steps">
                <span className={step >= 1 ? "current" : ""}>
                  <i>01</i> Service
                </span>
                <b />
                <span className={step >= 2 ? "current" : ""}>
                  <i>02</i> Time
                </span>
                <b />
                <span className={step >= 3 ? "current" : ""}>
                  <i>03</i> Your details
                </span>
              </div>
              {step === 1 && (
                <div className="booking-step">
                  <h2>Which services would you like?</h2>
                  <p>
                    Open a service category to choose one or more treatments.
                    The estimated total uses each treatment’s current offer
                    price, when available.
                  </p>
                  {servicesLoading ? (
                    <BrandLoader
                      message="Preparing your service menu"
                      detail="Loading available treatments and prices."
                    />
                  ) : servicesError ? (
                    <div className="service-catalog-error" role="alert">
                      <span className="service-catalog-error-icon" aria-hidden="true">
                        !
                      </span>
                      <div className="service-catalog-error-copy">
                        <strong>Services aren’t available right now</strong>
                        <p>
                          We couldn’t load the service menu. Please try again
                          shortly.
                        </p>
                        {servicesError !== "Failed to fetch" && (
                          <small>{servicesError}</small>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={reloadServices}
                        aria-label="Retry loading services"
                      >
                        <span aria-hidden="true">↻</span> Try again
                      </button>
                    </div>
                  ) : activeServices.length === 0 ? (
                    <p className="service-catalog-message">
                      No services are available to book right now.
                    </p>
                  ) : (
                  <div className="choice-list">
                    {activeServices.map((category) => {
                      const selectedCount = selectedServices.filter(
                        (service) => service.categoryId === category.id,
                      ).length;
                      const activeSubServices = category.subServices.filter(
                        (service) => service.active,
                      );
                      if (!activeSubServices.length) return null;
                      return (
                        <details className="service-category" key={category.id}>
                          <summary className="service-category-heading">
                            <span className="service-category-icon" aria-hidden="true">
                              {serviceCategoryIcon(category)}
                            </span>
                            <span className="service-category-copy">
                              <strong>{category.name}</strong>
                              <small>{category.description}</small>
                            </span>
                            <span className="service-category-count">
                              {selectedCount > 0
                                ? `${selectedCount} selected`
                                : "View services"}
                            </span>
                            <span className="service-category-chevron" />
                          </summary>
                          <div className="service-item-list">
                            {activeSubServices.map((item) => (
                              <label
                                className="service-item-option"
                                key={item.id}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedServices.some(
                                    (selected) =>
                                      selected.subServiceId === item.id,
                                  )}
                                  onChange={() => toggleService(category, item)}
                                />
                                <span className="service-item-name">
                                  {item.name}
                                  {item.durationMinutes > 0 && (
                                    <small>{item.durationMinutes} min</small>
                                  )}
                                </span>
                                <span className="service-item-price">
                                  {item.offerPrice !== null && (
                                    <del>{formatPrice(item.price)}</del>
                                  )}
                                  <strong>
                                    {formatPrice(
                                      item.offerPrice ?? item.price,
                                    )}
                                  </strong>
                                </span>
                              </label>
                            ))}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                  )}
                  {selectedServices.length > 0 && (
                    <SelectedServicesSummary
                      services={selectedServices}
                      onRemove={removeSelectedService}
                    />
                  )}
                </div>
              )}
              {step === 2 && (
                <div className="booking-step">
                  <h2>Pick a day that feels good.</h2>
                  <p>
                    Choose today or any upcoming date and a preferred start
                    time. We’ll confirm the appointment duration based on
                    your selected services.
                  </p>
                  <SelectedServicesSummary
                    services={selectedServices}
                  />
                  <label className="booking-input">
                    Choose any date
                    <input
                      type="date"
                      min={todayDate}
                      value={date}
                      onChange={(event) => {
                        setDate(event.target.value);
                        setTime("");
                        setBookingError("");
                        setAvailabilityError("");
                        setAvailabilityLoading(true);
                      }}
                      required
                    />
                  </label>
                  <h3>Preferred start time</h3>
                  {!date ? (
                    <p className="booking-inline-note">
                      Choose a date, then select your preferred start time.
                    </p>
                  ) : (
                    <label className="booking-input">
                      Preferred start time
                      <select
                        value={time}
                        disabled={
                          availabilityLoading || Boolean(availabilityError)
                        }
                        onChange={(event) => {
                          setTime(event.target.value);
                          setBookingError("");
                        }}
                        required
                      >
                        <option value="">
                          {availabilityLoading
                            ? "Checking available times…"
                            : "Select an hourly slot"}
                        </option>
                        {APPOINTMENT_TIME_SLOTS.map((slotStart) => {
                          const value = `${String(Math.floor(slotStart / 60)).padStart(2, "0")}:00`;
                          const unavailable = isSlotUnavailable(slotStart);
                          return (
                            <option
                              key={value}
                              value={value}
                              disabled={unavailable}
                            >
                              {formatAppointmentTime(slotStart)}
                              {unavailable
                                ? slotStart + selectedDurationMinutes >
                                  APPOINTMENT_CLOSING_MINUTES
                                  ? " · Ends after closing"
                                  : " · Booked"
                                : " · Available"}
                            </option>
                          );
                        })}
                      </select>
                      <small>
                        Hourly start times from 9:00 AM to 9:00 PM. Your
                        appointment must finish by 10:00 PM.
                      </small>
                    </label>
                  )}
                  {date && availabilityError && (
                    <div className="booking-availability-error" role="alert">
                      <span>
                        Could not check availability: {availabilityError}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAvailabilityLoading(true);
                          setAvailabilityError("");
                          setAvailabilityReload((current) => current + 1);
                        }}
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="booking-step">
                  <h2>Who are we welcoming?</h2>
                  <p>We’ll send your appointment details here.</p>
                  <label className="booking-input">
                    Your name
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </label>
                  <label className="booking-input">
                    Email address
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label className="booking-input">
                    Phone number
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      required
                    />
                  </label>
                  <label className="booking-input">
                    Anything you’d like us to know? <small>Optional</small>
                    <textarea
                      rows={3}
                      placeholder="A little note for your artist…"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </label>
                  <SelectedServicesSummary
                    services={selectedServices}
                  />
                  <p className="booking-recap">
                    {selectedDateLabel} · {time ? formatTime(time) : ""}
                  </p>
                  {submitting && (
                    <BrandLoader
                      message="Confirming your appointment"
                      detail="Saving your visit with the salon."
                      variant="compact"
                    />
                  )}
                </div>
              )}
              {bookingError && (
                <div className="booking-api-error" role="alert">
                  <span>{bookingError}</span>
                </div>
              )}
              <div className="booking-actions">
                {step > 1 && (
                  <button
                    className="back-button"
                    onClick={() => setStep(step - 1)}
                  >
                    ← Back
                  </button>
                )}
                <button
                  className="editorial-button"
                  type="button"
                  onClick={next}
                  disabled={submitting}
                >
                  {submitting
                    ? "Booking your visit…"
                    : step === 3
                      ? "Confirm appointment"
                      : "Continue"}{" "}
                  {!submitting && <span>→</span>}
                </button>
              </div>
            </section>
            <aside className="booking-aside">
              <span className="page-kicker">A NOTE FROM US</span>
              <blockquote>
                “You deserve a little time that’s just for you.”
              </blockquote>
              <p>
                Need a hand choosing? We’re happy to help you figure out what
                feels right.
              </p>
              <a href="tel:+919838732382">Call us · 9838732382</a>
              <a href="mailto:janviratan007@gmail.com">
                janviratan007@gmail.com
              </a>
              <div className="booking-aside-hours">
                Central Bank Building, opposite Gyandeep Academy
                <br />
                Vishwakarma Nagar, Mohanpuri Colony, Chitaipur, Varanasi
                <br />
                <br />
                Mansarovar Shopping Complex, NTPC Campus, Bijpur
                <br />
                Rihand Nagar, Uttar Pradesh 231223
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
