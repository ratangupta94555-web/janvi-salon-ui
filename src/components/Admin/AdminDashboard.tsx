import React, { useCallback, useEffect, useMemo, useState } from "react";
import AdminServices from "./AdminServices";
import AdminPagination from "./AdminPagination";
import "./AdminDashboard.css";
import "./AdminAppointments.css";
import BrandLoader from "../common/BrandLoader";
import {
  APPOINTMENT_CLOSING_MINUTES,
  APPOINTMENT_SLOT_MINUTES,
  APPOINTMENT_STATUSES,
  APPOINTMENT_TIME_SLOTS,
  appointmentApi,
  Appointment,
  AppointmentStatus,
  appointmentTimeToMinutes,
  formatAppointmentTime,
  isValidPhoneNumber,
  isAppointmentTimeSlotUnavailable,
  isAppointmentTimeSlotInPast,
  normalizeAppointmentStatus,
} from "../../api/appointments";
import {
  ApiSubService,
  formatPrice,
} from "../../api/services";
import useServices from "../../api/useServices";

type IconName =
  | "grid"
  | "calendar"
  | "users"
  | "scissors"
  | "chart"
  | "search"
  | "plus"
  | "arrow"
  | "clock"
  | "check"
  | "more"
  | "sparkle"
  | "chevron"
  | "close"
  | "eye"
  | "menu"
  | "logout";
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const shapes: Record<IconName, React.ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
        <path d="m9 15 2 2 4-4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    scissors: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="m8.2 8.2 12.6 12.6M14.5 9.5 20.8 3.2M8.2 15.8 12 12" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-5 5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: (
      <>
        <path d="M7 17 17 7M7 7h10v10" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
        <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-6" />
      </>
    ),
  };
  return <svg {...common}>{shapes[name]}</svg>;
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Dashboard", icon: "grid" },
  { label: "Appointments", icon: "calendar" },
  { label: "Services", icon: "scissors" },
  { label: "Treatments", icon: "sparkle" },
];

type AdminDashboardProps = {
  pathname: string;
  onLogout: () => void;
  onNavigate: (to: string) => void;
};

const adminPagePaths: Record<string, string> = {
  Dashboard: "/admin/dashboard",
  Appointments: "/admin/appointments",
  Clients: "/admin/clients",
  Services: "/admin/services",
  Treatments: "/admin/treatments",
};

function pageFromPath(pathname: string): string {
  return (
    Object.entries(adminPagePaths).find(([, path]) => path === pathname)?.[0] ??
    "Dashboard"
  );
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getRecentDateKeys(days: number): string[] {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (days - index - 1),
    );
    return localDateKey(date);
  });
}

function getUpcomingDateKeys(days: number): string[] {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + index,
    );
    return localDateKey(date);
  });
}

function appointmentItemsTotal(appointment: Appointment): number | undefined {
  if (!appointment.items?.length) return undefined;
  const itemTotals = appointment.items.map((item) => item.totalPrice);
  if (!itemTotals.every(Number.isFinite)) return undefined;
  return itemTotals.reduce((total, itemTotal) => total + itemTotal, 0);
}

function appointmentBookedValue(appointment: Appointment): number {
  return (
    appointment.totalAmount ??
    appointmentItemsTotal(appointment) ??
    appointment.subtotal ??
    0
  );
}

function compactCurrency(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return formatPrice(value);
}

function AdminDashboard({
  pathname,
  onLogout,
  onNavigate,
}: AdminDashboardProps) {
  const page = pageFromPath(pathname);
  const {
    services: serviceCatalogue,
    loading: serviceCatalogueLoading,
    error: serviceCatalogueError,
  } = useServices();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dashboardAppointments, setDashboardAppointments] = useState<
    Appointment[]
  >([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState("");
  const [appointmentsReload, setAppointmentsReload] = useState(0);
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    return localDateKey(new Date());
  });
  const dashboardDateKeys = useMemo(() => getRecentDateKeys(7), []);
  const dashboardUpcomingDateKeys = useMemo(() => getUpcomingDateKeys(7), []);
  const dashboardFetchDateKeys = useMemo(
    () =>
      Array.from(new Set([...dashboardDateKeys, ...dashboardUpcomingDateKeys])),
    [dashboardDateKeys, dashboardUpcomingDateKeys],
  );
  const dashboardToday = dashboardDateKeys[dashboardDateKeys.length - 1];
  const [appointmentStatusUpdatingId, setAppointmentStatusUpdatingId] =
    useState<number | null>(null);
  const [detailsAppointment, setDetailsAppointment] =
    useState<Appointment | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [appointmentPage, setAppointmentPage] = useState(1);
  const appointmentPageSize = 10;
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState(selectedDate);
  const [bookingTime, setBookingTime] = useState("");
  const [bookingAvailabilityClock, setBookingAvailabilityClock] = useState(
    () => new Date(),
  );
  const [bookingAppointments, setBookingAppointments] = useState<Appointment[]>(
    [],
  );
  const [bookingAvailabilityLoading, setBookingAvailabilityLoading] =
    useState(false);
  const [bookingAvailabilityError, setBookingAvailabilityError] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingTreatmentIds, setBookingTreatmentIds] = useState<number[]>([]);

  useEffect(() => {
    if (!bookingOpen) return;
    const interval = window.setInterval(
      () => setBookingAvailabilityClock(new Date()),
      15_000,
    );
    return () => window.clearInterval(interval);
  }, [bookingOpen]);
  const selectedBookingTreatments = serviceCatalogue.flatMap((service) =>
    service.subServices
      .filter((treatment) => bookingTreatmentIds.includes(treatment.id))
      .map((treatment) => treatment.name),
  );
  const bookingTotal = serviceCatalogue.reduce(
    (total, service) =>
      total +
      service.subServices.reduce(
        (serviceTotal, treatment) =>
          bookingTreatmentIds.includes(treatment.id)
            ? serviceTotal + (treatment.offerPrice ?? treatment.price)
            : serviceTotal,
        0,
      ),
    0,
  );
  const bookingDurationMinutes = Math.max(
    APPOINTMENT_SLOT_MINUTES,
    serviceCatalogue.reduce(
      (total, service) =>
        total +
        service.subServices.reduce(
          (serviceTotal, treatment) =>
            bookingTreatmentIds.includes(treatment.id)
              ? serviceTotal + treatment.durationMinutes
              : serviceTotal,
          0,
        ),
      0,
    ),
  );
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();
  useEffect(() => {
    if (page !== "Appointments") return;
    const controller = new AbortController();
    setAppointmentsLoading(true);
    setAppointmentsError("");
    appointmentApi
      .byDate(selectedDate, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setAppointments(result);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setAppointmentsError(
            error instanceof Error
              ? error.message
              : "Appointments could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setAppointmentsLoading(false);
      });
    return () => controller.abort();
  }, [page, selectedDate, appointmentsReload]);

  useEffect(() => {
    if (page !== "Dashboard") return;
    const controller = new AbortController();
    setDashboardLoading(true);
    setDashboardError("");
    Promise.all(
      dashboardFetchDateKeys.map((date) =>
        appointmentApi.byDate(date, controller.signal),
      ),
    )
      .then((dailyAppointments) => {
        if (!controller.signal.aborted) {
          setDashboardAppointments(dailyAppointments.flat());
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setDashboardError(
            error instanceof Error
              ? error.message
              : "Dashboard appointment data could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setDashboardLoading(false);
      });
    return () => controller.abort();
  }, [page, dashboardFetchDateKeys, appointmentsReload]);

  useEffect(() => {
    if (!bookingOpen || !bookingDate) return;
    const controller = new AbortController();
    setBookingAvailabilityLoading(true);
    setBookingAvailabilityError("");
    setBookingAppointments([]);
    appointmentApi
      .byDate(bookingDate, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setBookingAppointments(result);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setBookingAvailabilityError(
            error instanceof Error
              ? error.message
              : "Could not check appointment availability.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBookingAvailabilityLoading(false);
      });
    return () => controller.abort();
  }, [bookingOpen, bookingDate, appointmentsReload]);

  const appointmentName = useCallback(
    (item: Appointment) =>
      item.customerName ||
      `${item.customer?.firstName ?? item.firstName ?? ""} ${item.customer?.lastName ?? item.lastName ?? ""}`.trim() ||
      item.customer?.phone ||
      item.phone ||
      `Appointment #${item.id}`,
    [],
  );
  const appointmentServices = useCallback(
    (item: Appointment) =>
      item.items?.map((service) => service.subServiceName).join(", ") ||
      item.subServiceIds?.map((id) => `Service #${id}`).join(", ") ||
      "Services not listed",
    [],
  );
  const appointmentTotal = (item: Appointment) =>
    item.totalAmount ??
    appointmentItemsTotal(item) ??
    item.subtotal;
  const appointmentTime = (item: Appointment) =>
    item.startTime ?? item.preferredStartTime ?? "Time not set";
  const openAppointmentDetails = async (item: Appointment) => {
    setDetailsAppointment(item);
    setDetailsLoading(true);
    setDetailsError("");
    try {
      setDetailsAppointment(await appointmentApi.get(item.id));
    } catch (error) {
      setDetailsError(
        error instanceof Error
          ? error.message
          : "Unable to load appointment details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };
  const filteredAppointments = useMemo(
    () =>
      appointments.filter((item) =>
        `${appointmentName(item)} ${appointmentServices(item)} ${item.customer?.phone ?? item.phone ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [appointments, appointmentName, appointmentServices, query],
  );
  const appointmentPageCount = Math.max(
    1,
    Math.ceil(filteredAppointments.length / appointmentPageSize),
  );
  const currentAppointmentPage = Math.min(
    appointmentPage,
    appointmentPageCount,
  );
  const visibleAppointments = filteredAppointments.slice(
    (currentAppointmentPage - 1) * appointmentPageSize,
    currentAppointmentPage * appointmentPageSize,
  );
  useEffect(() => {
    setAppointmentPage(1);
  }, [query, selectedDate]);
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const toggleBookingTreatment = (treatment: ApiSubService) => {
    setBookingTreatmentIds((current) =>
      current.includes(treatment.id)
        ? current.filter((id) => id !== treatment.id)
        : [...current, treatment.id],
    );
  };
  const isBookingSlotUnavailable = (slotStart: number) => {
    return isAppointmentTimeSlotUnavailable(
      slotStart,
      bookingDurationMinutes,
      bookingAppointments,
    ) ||
      isAppointmentTimeSlotInPast(
        bookingDate,
        slotStart,
        bookingAvailabilityClock,
      );
  };
  const submitAdminBooking = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!bookingName.trim()) {
      setBookingError("Enter the client name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingEmail.trim())) {
      setBookingError("Enter a valid email address.");
      return;
    }
    if (!isValidPhoneNumber(bookingPhone)) {
      setBookingError("Enter a valid client phone number.");
      return;
    }
    if (!bookingDate || bookingDate < localDateKey(new Date())) {
      setBookingError("Choose today or a future date.");
      return;
    }
    if (!bookingTreatmentIds.length) {
      setBookingError("Select at least one treatment.");
      return;
    }
    const selectedStart = appointmentTimeToMinutes(bookingTime);
    if (
      selectedStart === undefined ||
      bookingAvailabilityLoading ||
      bookingAvailabilityError ||
      isAppointmentTimeSlotInPast(bookingDate, selectedStart) ||
      isBookingSlotUnavailable(selectedStart)
    ) {
      setBookingError(
        bookingAvailabilityError ||
          (selectedStart !== undefined &&
          isAppointmentTimeSlotInPast(bookingDate, selectedStart)
            ? "That time has already passed. Please choose a future slot."
            : "") ||
          "That time is unavailable. Please choose an available slot.",
      );
      return;
    }
    const nameParts = bookingName.trim().split(/\s+/);
    const lastName = nameParts.slice(1).join(" ") || "N/A";
    setBookingSubmitting(true);
    setBookingError("");
    try {
      await appointmentApi.create({
        firstName: nameParts[0],
        lastName,
        email: bookingEmail.trim(),
        phone: bookingPhone.trim(),
        subServiceIds: bookingTreatmentIds,
        appointmentDate: bookingDate,
        preferredStartTime: bookingTime,
        ...(bookingNotes.trim() ? { notes: bookingNotes.trim() } : {}),
      });
      setBookingOpen(false);
      setSelectedDate(bookingDate);
      setAppointmentsReload((current) => current + 1);
      notify("Appointment scheduled.");
      setBookingName("");
      setBookingEmail("");
      setBookingPhone("");
      setBookingTime("");
      setBookingNotes("");
      setBookingTreatmentIds([]);
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "The appointment could not be scheduled.",
      );
    } finally {
      setBookingSubmitting(false);
    }
  };
  const updateAppointmentStatus = async (
    appointment: Appointment,
    status: AppointmentStatus,
  ) => {
    if (normalizeAppointmentStatus(appointment.status) === status) return;
    setAppointmentStatusUpdatingId(appointment.id);
    try {
      await appointmentApi.updateStatus(appointment.id, status);
      setAppointmentsReload((current) => current + 1);
      notify("Appointment status updated.");
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "Appointment status could not be updated.",
      );
      setAppointmentsReload((current) => current + 1);
    } finally {
      setAppointmentStatusUpdatingId(null);
    }
  };
  const dashboardActiveAppointments = dashboardAppointments.filter((item) => {
    const status = normalizeAppointmentStatus(item.status);
    return status !== "CANCELLED" && status !== "NO_SHOW";
  });
  const dashboardRecentDateKeySet = new Set(dashboardDateKeys);
  const dashboardRecentActiveAppointments = dashboardActiveAppointments.filter(
    (item) => dashboardRecentDateKeySet.has(item.appointmentDate),
  );
  const dashboardTodayAppointments = dashboardActiveAppointments.filter(
    (item) => item.appointmentDate === dashboardToday,
  );
  const dashboardUpcomingDateKeySet = new Set(dashboardUpcomingDateKeys);
  const dashboardUpcomingAppointments = dashboardActiveAppointments
    .filter((item) => {
      const status = normalizeAppointmentStatus(item.status);
      return (
        dashboardUpcomingDateKeySet.has(item.appointmentDate) &&
        (status === "PENDING" || status === "CONFIRMED")
      );
    })
    .sort((first, second) => {
      const dateDifference = first.appointmentDate.localeCompare(
        second.appointmentDate,
      );
      if (dateDifference) return dateDifference;
      return (
        (appointmentTimeToMinutes(appointmentTime(first)) ?? Infinity) -
        (appointmentTimeToMinutes(appointmentTime(second)) ?? Infinity)
      );
    });
  const dashboardTodayValue = dashboardTodayAppointments.reduce(
    (total, item) => total + appointmentBookedValue(item),
    0,
  );
  const dashboardTreatmentsThisWeek = dashboardRecentActiveAppointments.reduce(
    (total, appointment) =>
      total +
      (appointment.items ?? []).reduce(
        (itemTotal, item) => itemTotal + (item.quantity ?? 1),
        0,
      ),
    0,
  );
  const dashboardDailyValues = dashboardDateKeys.map((date) => ({
    date,
    value: dashboardRecentActiveAppointments
      .filter((item) => item.appointmentDate === date)
      .reduce((total, item) => total + appointmentBookedValue(item), 0),
  }));
  const dashboardMaxDailyValue = Math.max(
    1,
    ...dashboardDailyValues.map((day) => day.value),
  );
  const dashboardChartPoints = dashboardDailyValues
    .map((day, index) => {
      const x =
        dashboardDailyValues.length === 1
          ? 0
          : (index / (dashboardDailyValues.length - 1)) * 390;
      const y = 112 - (day.value / dashboardMaxDailyValue) * 95;
      return `${x},${y}`;
    })
    .join(" ");
  const dashboardAreaPath = `M 0 126 L ${dashboardChartPoints
    .split(" ")
    .map((point) => point.replace(",", " "))
    .join(" L ")} L 390 126 Z`;
  const dashboardPopularTreatments = (() => {
    const treatments = new Map<
      string,
      { name: string; bookings: number; bookedValue: number }
    >();
    dashboardRecentActiveAppointments.forEach((appointment) => {
      (appointment.items ?? []).forEach((item) => {
        const name = item.subServiceName || item.serviceName || "Treatment";
        const key = `${item.subServiceId ?? name}:${name}`;
        const summary = treatments.get(key) ?? {
          name,
          bookings: 0,
          bookedValue: 0,
        };
        summary.bookings += item.quantity ?? 1;
        summary.bookedValue += item.totalPrice ?? 0;
        treatments.set(key, summary);
      });
    });
    return Array.from(treatments.values())
      .sort(
        (first, second) =>
          second.bookings - first.bookings ||
          second.bookedValue - first.bookedValue,
      )
      .slice(0, 3);
  })();
  const selectPage = (label: string) => {
    onNavigate(adminPagePaths[label] ?? adminPagePaths.Dashboard);
    setMobileMenu(false);
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <a
          href={adminPagePaths.Dashboard}
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            selectPage("Dashboard");
          }}
        >
          <span className="brand-mark">
            <img src="/jaya-icon.svg" alt="" />
          </span>
          <span>
            Janvi Makeover<span className="brand-dot">.</span>
            <small>STUDIO MANAGER</small>
          </span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <button className="salon-switch">
          <span className="salon-avatar">A</span>
          <span className="salon-name">
            Janvi Makeover Studio<small>Varanasi & Rihand Nagar, UP</small>
          </span>
          <Icon name="chevron" size={15} />
        </button>
        <div className="nav-label">MENU</div>
        <nav className="side-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${page === item.label ? "active" : ""}`}
              onClick={() => selectPage(item.label)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.label === "Appointments" && (
                <span className="nav-count">{appointments.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button
            className="profile-row"
            onClick={() => notify("Profile settings opened")}
          >
            <span className="profile-photo">JL</span>
            <span className="profile-name">
              Jamie Lee<small>Studio owner</small>
            </span>
            <Icon name="more" />
          </button>
        </div>
      </aside>
      {mobileMenu && (
        <button
          className="scrim"
          onClick={() => setMobileMenu(false)}
          aria-label="Close menu"
        />
      )}
      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu-button icon-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{page}</strong>
          </div>
          <div className="topbar-actions">
            {page === "Appointments" && (
              <label className="search-box">
                <Icon name="search" size={17} />
                <input
                  aria-label="Search appointments"
                  placeholder="Search appointments..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <kbd>⌘ K</kbd>
              </label>
            )}
            <button
              className="top-avatar"
              onClick={() => notify("Profile settings opened")}
            >
              JL
            </button>
            <button
              className="icon-button"
              aria-label="Log out"
              title="Log out"
              onClick={onLogout}
            >
              <Icon name="logout" />
            </button>
          </div>
        </header>
        <div className="page-wrap">
          {page !== "Services" && page !== "Treatments" && (
          <div className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot" /> {todayLabel}
              </div>
              <h1>
                {page === "Dashboard" ? (
                  <>
                    Studio overview <span className="wave">✳</span>
                  </>
                ) : (
                  page
                )}
              </h1>
              <p className="welcome-subtitle">
                {page === "Dashboard"
                  ? "Here’s what’s happening at your studio today."
                  : `Your ${page.toLowerCase()} at a glance.`}
              </p>
            </div>
            {page === "Appointments" && (
              <div className="welcome-actions">
                <div className="date-picker">
                  <Icon name="calendar" size={16} />
                  <input
                    type="date"
                    aria-label="Select date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setBookingDate(selectedDate);
                    setBookingTime("");
                    setBookingError("");
                    setBookingAvailabilityError("");
                    setBookingAvailabilityLoading(true);
                    setBookingOpen(true);
                  }}
                >
                  <Icon name="plus" size={17} /> New appointment
                </button>
              </div>
            )}
          </div>
          )}
          {page === "Dashboard" ? (
            dashboardLoading ? (
              <BrandLoader
                message="Loading studio overview"
                detail="Gathering appointment activity for the past seven days."
              />
            ) : dashboardError ? (
              <div className="dashboard-feedback panel" role="alert">
                <strong>Studio data isn’t available right now</strong>
                <p>{dashboardError}</p>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() =>
                    setAppointmentsReload((current) => current + 1)
                  }
                >
                  Try again
                </button>
              </div>
            ) : (
            <>
              <div className="dashboard-overview-layout">
                <div className="dashboard-overview-main">
                  <section
                    className="stats-grid stats-grid-overview"
                    aria-label="Studio statistics"
                  >
                <article className="stat-card">
                  <div className="stat-heading">
                    TODAY’S BOOKED VALUE{" "}
                    <span className="stat-icon green">
                      <span className="currency">₹</span>
                    </span>
                  </div>
                  <div className="stat-value">
                    {formatPrice(dashboardTodayValue)}
                  </div>
                  <div className="stat-note">
                    {dashboardTodayAppointments.length} appointment
                    {dashboardTodayAppointments.length === 1 ? "" : "s"} today
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-heading">
                    APPOINTMENTS TODAY{" "}
                    <span className="stat-icon peach">
                      <Icon name="calendar" size={17} />
                    </span>
                  </div>
                  <div className="stat-value">{dashboardTodayAppointments.length}</div>
                  <div className="stat-note">Excludes cancelled and no-show bookings</div>
                </article>
                <article className="stat-card">
                  <div className="stat-heading">
                    TREATMENTS THIS WEEK{" "}
                    <span className="stat-icon blue">
                      <Icon name="sparkle" size={17} />
                    </span>
                  </div>
                  <div className="stat-value">{dashboardTreatmentsThisWeek}</div>
                  <div className="stat-note">From appointments in the past seven days</div>
                </article>
                  </section>
                  <section className="feature-row feature-row-overview">
                <article className="performance-card panel">
                  <div className="panel-header">
                    <div>
                      <h2>Studio performance</h2>
                      <p>Booked value over the past seven days</p>
                    </div>
                  </div>
                  <div className="chart-total">
                    <strong>
                      {formatPrice(
                        dashboardDailyValues.reduce(
                          (total, day) => total + day.value,
                          0,
                        ),
                      )}
                    </strong>
                  </div>
                  <div className="chart-caption">
                    Total booked value{" "}
                    <span>excluding cancelled and no-show appointments</span>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-y-labels">
                      <span>{compactCurrency(dashboardMaxDailyValue)}</span>
                      <span>{compactCurrency(dashboardMaxDailyValue / 2)}</span>
                      <span>{compactCurrency(0)}</span>
                    </div>
                    <div className="chart-area">
                      <div className="chart-gridlines">
                        <i />
                        <i />
                        <i />
                      </div>
                      <svg
                        viewBox="0 0 390 126"
                        preserveAspectRatio="none"
                        className="revenue-chart"
                        role="img"
                        aria-label="Daily booked value for the past seven days"
                      >
                        <defs>
                          <linearGradient
                            id="chartFill"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="0"
                              stopColor="#9d83de"
                              stopOpacity=".24"
                            />
                            <stop
                              offset="1"
                              stopColor="#9d83de"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d={dashboardAreaPath}
                          fill="url(#chartFill)"
                        />
                        <path
                          d={`M ${dashboardChartPoints.replace(/,/g, " ")}`}
                          fill="none"
                          stroke="#8f70ce"
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        {dashboardChartPoints.split(" ").map((point, index) => {
                          const [cx, cy] = point.split(",");
                          return (
                            <circle
                              key={dashboardDateKeys[index]}
                              cx={cx}
                              cy={cy}
                              r="3"
                              fill="#fff"
                              stroke="#8f70ce"
                              strokeWidth="2"
                              vectorEffect="non-scaling-stroke"
                            />
                          );
                        })}
                      </svg>
                      <div className="chart-x-labels">
                        {dashboardDailyValues.map((day) => (
                          <span key={day.date}>
                            {new Intl.DateTimeFormat("en-US", {
                              weekday: "short",
                            }).format(new Date(`${day.date}T00:00:00`))}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <span />
                    <i>Booked value</i>
                    <small>Daily total</small>
                  </div>
                </article>
                  </section>
                </div>
                <article className="popular-card panel upcoming-appointments-card">
                  <div className="panel-header">
                    <div>
                      <h2><Icon name="calendar" size={16} /> Upcoming appointments</h2>
                      <p>Pending and confirmed · next 7 days</p>
                    </div>
                    <span className="upcoming-calendar-count">
                      {dashboardUpcomingAppointments.length}
                    </span>
                  </div>
                  <div className="upcoming-appointment-list">
                    {dashboardUpcomingAppointments.length ? (
                      dashboardUpcomingAppointments.map((item) => {
                        const startTime = appointmentTimeToMinutes(
                          appointmentTime(item),
                        );
                        const status = normalizeAppointmentStatus(item.status);
                        const date = new Date(`${item.appointmentDate}T00:00:00`);
                        const isToday = item.appointmentDate === dashboardToday;
                        return (
                          <button
                            className={`upcoming-appointment-row ${isToday ? "today" : ""}`}
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedDate(item.appointmentDate);
                              selectPage("Appointments");
                            }}
                            aria-label={`View appointment for ${appointmentName(item)} on ${item.appointmentDate}`}
                          >
                            <span className="upcoming-appointment-date">
                              <small>
                                {isToday
                                  ? "Today"
                                  : new Intl.DateTimeFormat("en-US", {
                                      weekday: "short",
                                    }).format(date)}
                              </small>
                              <strong>
                                {new Intl.DateTimeFormat("en-US", {
                                  month: "short",
                                  day: "numeric",
                                }).format(date)}
                              </strong>
                            </span>
                            <span className="upcoming-appointment-details">
                              <strong>{appointmentName(item)}</strong>
                              <small>
                                {startTime !== undefined
                                  ? formatAppointmentTime(startTime)
                                  : appointmentTime(item)}{" "}
                                · {appointmentServices(item)}
                              </small>
                            </span>
                            <span
                              className={`upcoming-appointment-status ${status?.toLowerCase()}`}
                            >
                              {status === "CONFIRMED" ? "Confirmed" : "Pending"}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="dashboard-empty">
                        No upcoming appointments in the next seven days.
                      </p>
                    )}
                  </div>
                </article>
              </div>
              <section className="bottom-row">
                <article className="popular-card panel">
                  <div className="panel-header">
                    <div>
                      <h2>Popular treatments</h2>
                      <p>Ranked by bookings in the past seven days</p>
                    </div>
                  </div>
                  <div className="service-list">
                    {dashboardPopularTreatments.length ? (
                      dashboardPopularTreatments.map((treatment, index) => (
                        <div className="service-row" key={treatment.name}>
                          <span
                            className={`service-symbol ${
                              ["service-purple", "service-peach", "service-green"][index]
                            }`}
                          >
                            <Icon name={index === 0 ? "scissors" : "sparkle"} />
                          </span>
                          <span className="service-details">
                            <strong>{treatment.name}</strong>
                            <small>Past seven days</small>
                          </span>
                          <span className="service-bookings">
                            {treatment.bookings} <small>bookings</small>
                          </span>
                          <span className="service-revenue">
                            {formatPrice(treatment.bookedValue)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="dashboard-empty">
                        No treatment bookings were recorded in the past seven days.
                      </p>
                    )}
                  </div>
                </article>
              </section>
            </>
            )
          ) : page === "Services" || page === "Treatments" ? (
            <AdminServices
              notify={notify}
              view={page === "Treatments" ? "subServices" : "services"}
            />
          ) : (
            <section className="section-page panel">
              <div className="panel-header">
                <div>
                  <h2 className="admin-section-heading">
                    <Icon
                      name={page === "Appointments" ? "calendar" : "users"}
                      size={16}
                    />
                    {page}{" "}
                    <span className="count-pill">
                      {page === "Appointments"
                        ? appointments.length
                        : page === "Clients"
                          ? 248
                          : 6}
                    </span>
                  </h2>
                  <p>Manage your studio {page.toLowerCase()} in one place.</p>
                </div>
                {page !== "Appointments" && (
                  <button
                    className="primary-button"
                    onClick={() =>
                      notify(`Add ${page.slice(0, -1).toLowerCase()} flow opened`)
                    }
                  >
                    <Icon name="plus" size={16} /> Add{" "}
                    {page.slice(0, -1).toLowerCase()}
                  </button>
                )}
              </div>
              {page === "Appointments" ? (
                appointmentsLoading ? (
                  <BrandLoader
                    message="Loading appointments"
                    detail="Fetching the studio schedule for this date."
                  />
                ) : appointmentsError ? (
                  <div className="appointments-error" role="alert">
                    <span className="appointments-error-mark" aria-hidden="true">
                      <Icon name="calendar" size={23} />
                      <i>!</i>
                    </span>
                    <span className="appointments-error-kicker">
                      Schedule connection
                    </span>
                    <strong>Appointments aren’t available right now</strong>
                    <span className="appointments-error-description">
                      We couldn’t reach your appointment service. Check your
                      connection, then give it another try.
                    </span>
                    <button
                      type="button"
                      className="appointments-retry-button"
                      onClick={() =>
                        setAppointmentsReload((current) => current + 1)
                      }
                    >
                      <span aria-hidden="true">↻</span> Try again
                    </button>
                    <small className="appointments-error-reference">
                      Your schedule hasn’t been changed.
                    </small>
                  </div>
                ) : filteredAppointments.length ? (
                  <div className="appointment-list expanded-list">
                    <div className="admin-appointment-table-scroll">
                      <table className="admin-appointment-table">
                        <thead>
                          <tr>
                            <th scope="col">Time</th>
                            <th scope="col">Client</th>
                            <th scope="col">Services</th>
                            <th scope="col">Total</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                    {visibleAppointments.map((item, index) => {
                      const customerName = appointmentName(item);
                      const totalAmount = appointmentTotal(item);
                      const initials = customerName
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();
                      const status = normalizeAppointmentStatus(item.status);
                      const statusLabel = (status ?? "UNKNOWN")
                        .toLowerCase()
                        .replaceAll("_", " ")
                        .replace(/\b\w/g, (letter) => letter.toUpperCase());
                      const timeParts = appointmentTime(item).split(":");
                      const hour = Number(timeParts[0]);
                      const displayTime = Number.isNaN(hour)
                        ? appointmentTime(item)
                        : `${hour % 12 || 12}:${timeParts[1]?.slice(0, 2) ?? "00"} ${hour >= 12 ? "PM" : "AM"}`;
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="admin-appointment-table-row">
                            <td>
                              <span className="admin-appointment-table-time">
                                <strong>{displayTime.split(" ")[0]}</strong>
                                <small>{displayTime.split(" ")[1]}</small>
                              </span>
                            </td>
                            <td>
                              <span className="admin-appointment-table-client">
                                <span
                                  className={`client-avatar ${["lavender", "peach", "sage", "blue"][((currentAppointmentPage - 1) * appointmentPageSize + index) % 4]}`}
                                >
                                  {initials}
                                </span>
                                <span>
                                  <strong>{customerName}</strong>
                                  {(item.customer?.phone || item.phone) && (
                                    <small>
                                      {item.customer?.phone ?? item.phone}
                                    </small>
                                  )}
                                </span>
                              </span>
                            </td>
                            <td className="admin-appointment-table-services">
                              {appointmentServices(item)}
                            </td>
                            <td className="admin-appointment-table-total">
                              {totalAmount !== undefined
                                ? formatPrice(totalAmount)
                                : "—"}
                            </td>
                            <td>
                              <select
                                className={`admin-appointment-status-select ${(status ?? "unknown").toLowerCase().replaceAll("_", "-")}`}
                                aria-label={`Change status for ${customerName}`}
                                value={status ?? ""}
                                disabled={
                                  status === undefined ||
                                  appointmentStatusUpdatingId === item.id
                                }
                                onChange={(event) => {
                                  const nextStatus = normalizeAppointmentStatus(
                                    event.target.value,
                                  );
                                  if (nextStatus) {
                                    void updateAppointmentStatus(
                                      item,
                                      nextStatus,
                                    );
                                  }
                                }}
                              >
                                {status === undefined && (
                                  <option value="" disabled>
                                    {statusLabel}
                                  </option>
                                )}
                                {APPOINTMENT_STATUSES.map(
                                  (appointmentStatus) =>
                                    appointmentStatus !== "IN_PROGRESS" &&
                                    appointmentStatus !== "NO_SHOW" && (
                                      <option
                                        key={appointmentStatus}
                                        value={appointmentStatus}
                                      >
                                        {appointmentStatus
                                          .toLowerCase()
                                          .replaceAll("_", " ")
                                          .replace(/\b\w/g, (letter) =>
                                            letter.toUpperCase(),
                                          )}
                                      </option>
                                    ),
                                )}
                              </select>
                            </td>
                            <td>
                              <button
                                className="admin-appointment-details-button"
                                type="button"
                                aria-label={`View booking details for ${customerName}`}
                                title="View booking details"
                                onClick={() => void openAppointmentDetails(item)}
                              >
                                <Icon name="eye" size={16} />
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                        </tbody>
                      </table>
                    </div>
                    <AdminPagination
                      currentPage={currentAppointmentPage}
                      pageSize={appointmentPageSize}
                      totalItems={filteredAppointments.length}
                      itemLabel="appointments"
                      onPageChange={setAppointmentPage}
                    />
                  </div>
                ) : (
                  <div className="appointments-empty">
                    <span className="appointments-empty-art" aria-hidden="true">
                      <Icon name="calendar" size={27} />
                      <i />
                    </span>
                    <span className="appointments-empty-date">
                      {new Intl.DateTimeFormat("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(`${selectedDate}T00:00:00`))}
                    </span>
                    <strong>Your schedule is clear</strong>
                    <span className="appointments-empty-description">
                      No appointments are booked for this day. Your studio has
                      room for something lovely.
                    </span>
                  </div>
                )
              ) : (
                <div className="placeholder-grid">
                  {page === "Clients" ? (
                    <div className="admin-client-table-scroll">
                      <table className="admin-client-table">
                        <thead>
                          <tr>
                            <th scope="col">Client</th>
                            <th scope="col">Recent activity</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                        ["Maya Chen", "Last visit · Jun 16", "MC"],
                        ["Sophie Laurent", "Last visit · Jun 12", "SL"],
                        ["Amara Johnson", "Last visit · Jun 11", "AJ"],
                        ["Charlotte Reed", "Last visit · Jun 10", "CR"],
                        ["Lily Parker", "Last visit · Jun 8", "LP"],
                        ["Elena Rivera", "Last visit · Jun 7", "ER"],
                          ].map((entry, index) => (
                            <tr key={entry[0]}>
                              <td>
                                <span className="admin-appointment-table-client">
                                  <span
                                    className={`client-avatar ${["lavender", "peach", "sage", "blue"][index % 4]}`}
                                  >
                                    {entry[2]}
                                  </span>
                                  <strong>{entry[0]}</strong>
                                </span>
                              </td>
                              <td>{entry[1]}</td>
                              <td>
                                <span className="admin-client-status">
                                  Active
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    [
                          ["Studio profile", "Business details and contact", "SP"],
                          ["Booking preferences", "Appointment settings", "BP"],
                          ["Opening hours", "Set your availability", "OH"],
                          ["Notifications", "Client and booking updates", "NT"],
                          ["Account security", "Manage admin access", "AS"],
                          ["Payments", "Payment preferences", "PY"],
                    ].map((entry, index) => (
                    <div className="placeholder-item" key={index}>
                      <span
                        className={`client-avatar ${["lavender", "peach", "sage", "blue"][index % 4]}`}
                      >
                        {entry[2]}
                      </span>
                      <div>
                        <strong>{entry[0]}</strong>
                        <small>{entry[1]}</small>
                      </div>
                      <span className="placeholder-end">
                        <Icon name="chevron" size={16} />
                      </span>
                    </div>
                    ))
                  )}
                </div>
              )}
            </section>
          )}
          <footer className="footer-note">
            Made with care, for the people who make you feel your best{" "}
            <span>✳</span>
          </footer>
        </div>
      </main>
      {bookingOpen && (
        <div
          className="admin-booking-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !bookingSubmitting
            ) {
              setBookingOpen(false);
            }
          }}
        >
          <form
            className="admin-booking-modal"
            onSubmit={submitAdminBooking}
            aria-busy={bookingSubmitting}
          >
            <div className="admin-booking-heading">
              <div>
                <span className="appointments-error-kicker">
                  STUDIO SCHEDULING
                </span>
                <h2>New appointment</h2>
                <p>Choose treatments, a preferred time, and client details.</p>
              </div>
              <button
                type="button"
                aria-label="Close appointment form"
                disabled={bookingSubmitting}
                onClick={() => setBookingOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="admin-booking-fields">
              <label>
                Client name
                <input
                  required
                  value={bookingName}
                  onChange={(event) => setBookingName(event.target.value)}
                  placeholder="First and last name"
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  required
                  value={bookingEmail}
                  onChange={(event) => setBookingEmail(event.target.value)}
                  placeholder="client@example.com"
                />
              </label>
              <label>
                Phone number
                <input
                  type="tel"
                  required
                  value={bookingPhone}
                  onChange={(event) => setBookingPhone(event.target.value)}
                  placeholder="+91 98765 43210"
                />
              </label>
              <label>
                Date
                <input
                  type="date"
                  required
                  min={localDateKey(new Date())}
                  value={bookingDate}
                  onChange={(event) => {
                    setBookingDate(event.target.value);
                    setBookingTime("");
                    setBookingAppointments([]);
                    setBookingAvailabilityError("");
                    setBookingAvailabilityLoading(true);
                  }}
                />
              </label>
              <label>
                Appointment time
                <select
                  required
                  value={bookingTime}
                  disabled={
                    bookingAvailabilityLoading ||
                    Boolean(bookingAvailabilityError)
                  }
                  onChange={(event) => setBookingTime(event.target.value)}
                >
                  <option value="">
                    {bookingAvailabilityLoading
                      ? "Checking available times…"
                      : "Select an hourly slot"}
                  </option>
                  {APPOINTMENT_TIME_SLOTS.map((slotStart) => {
                    const value = `${String(Math.floor(slotStart / 60)).padStart(2, "0")}:00`;
                    const past = isAppointmentTimeSlotInPast(
                      bookingDate,
                      slotStart,
                      bookingAvailabilityClock,
                    );
                    const unavailable =
                      past || isBookingSlotUnavailable(slotStart);
                    return (
                      <option
                        key={value}
                        value={value}
                        disabled={unavailable}
                      >
                        {formatAppointmentTime(slotStart)}
                        {past
                          ? " · Time passed"
                          : unavailable
                          ? slotStart + bookingDurationMinutes >
                            APPOINTMENT_CLOSING_MINUTES
                            ? " · Ends after closing"
                            : " · Booked"
                          : " · Available"}
                      </option>
                    );
                  })}
                </select>
                <small className="admin-booking-hours">
                  Start times are hourly from 9:00 AM to 9:00 PM; appointments
                  must end by 10:00 PM.
                </small>
              </label>
            </div>
            {bookingAvailabilityError && (
              <div>
                <p className="admin-booking-inline-error" role="alert">
                  Could not check availability: {bookingAvailabilityError}
                </p>
                <button
                  type="button"
                  className="appointments-retry-button"
                  onClick={() => {
                    setBookingAvailabilityLoading(true);
                    setBookingAvailabilityError("");
                    setAppointmentsReload((current) => current + 1);
                  }}
                >
                  Try checking again
                </button>
              </div>
            )}

            <fieldset className="admin-booking-treatments">
              <legend>Treatments <span>Select one or more</span></legend>
              {serviceCatalogueLoading ? (
                <BrandLoader
                  message="Loading treatments"
                  variant="compact"
                />
              ) : serviceCatalogueError ? (
                <p className="admin-booking-inline-error" role="alert">
                  Could not load treatments: {serviceCatalogueError}
                </p>
              ) : (
                <details className="admin-booking-treatment-select">
                  <summary aria-label="Choose one or more treatments">
                    <span>
                      {selectedBookingTreatments.length
                        ? selectedBookingTreatments.join(", ")
                        : "Select treatments"}
                    </span>
                    <span className="admin-booking-select-indicator">
                      {bookingTreatmentIds.length
                        ? `${bookingTreatmentIds.length} selected`
                        : "Multiple"}
                      <span aria-hidden="true">⌄</span>
                    </span>
                  </summary>
                  <div className="admin-booking-treatment-list">
                    {serviceCatalogue.length ? (
                      serviceCatalogue.map((service) => (
                        <section
                          className="admin-booking-service-group"
                          key={service.id}
                        >
                          <h3>
                            {service.name}
                            {!service.active && (
                              <span className="admin-booking-unavailable">
                                Service inactive
                              </span>
                            )}
                          </h3>
                          {service.subServices.map((treatment) => {
                            const unavailable =
                              !service.active || !treatment.active;
                            return (
                              <label
                                className={`admin-booking-treatment${unavailable ? " is-unavailable" : ""}`}
                                key={treatment.id}
                              >
                                <input
                                  type="checkbox"
                                  checked={bookingTreatmentIds.includes(
                                    treatment.id,
                                  )}
                                  disabled={unavailable}
                                  onChange={() =>
                                    toggleBookingTreatment(treatment)
                                  }
                                />
                                <span>
                                  <strong>{treatment.name}</strong>
                                  {!treatment.active && (
                                    <small>Inactive treatment</small>
                                  )}
                                </span>
                                <span className="admin-booking-treatment-meta">
                                  {treatment.durationMinutes} min ·{" "}
                                  {treatment.offerPrice !== null && (
                                    <del>
                                      {formatPrice(treatment.price)}
                                    </del>
                                  )}{" "}
                                  <strong>
                                    {formatPrice(
                                      treatment.offerPrice ?? treatment.price,
                                    )}
                                  </strong>
                                </span>
                              </label>
                            );
                          })}
                          {!service.subServices.length && (
                            <p className="admin-booking-service-empty">
                              No treatments have been added to this service.
                            </p>
                          )}
                        </section>
                      ))
                    ) : (
                      <p>No services were returned by the services API.</p>
                    )}
                  </div>
                  {!serviceCatalogue.some(
                    (service) =>
                      service.active &&
                      service.subServices.some((treatment) => treatment.active),
                  ) && (
                    <p className="admin-booking-availability-note">
                      There are currently no active treatments to book.
                      Inactive items are shown but cannot be selected. Activate
                      or add treatments in Services to make them available.
                    </p>
                  )}
                </details>
              )}
              <div className="admin-booking-total" aria-live="polite">
                <span>
                  Estimated total
                  <small>
                    {bookingTreatmentIds.length
                      ? `${bookingTreatmentIds.length} treatment${bookingTreatmentIds.length === 1 ? "" : "s"} selected`
                      : "Select treatments to calculate"}
                  </small>
                </span>
                <strong>{formatPrice(bookingTotal)}</strong>
              </div>
            </fieldset>

            <label className="admin-booking-notes">
              Notes <span>Optional</span>
              <textarea
                rows={3}
                value={bookingNotes}
                onChange={(event) => setBookingNotes(event.target.value)}
                placeholder="Add a note for the appointment"
              />
            </label>
            {bookingError && (
              <p className="admin-booking-inline-error" role="alert">
                {bookingError}
              </p>
            )}
            <div className="admin-booking-actions">
              <button
                className="admin-booking-cancel"
                type="button"
                disabled={bookingSubmitting}
                onClick={() => setBookingOpen(false)}
              >
                Cancel
              </button>
              <button
                className="primary-button"
                type="submit"
                disabled={
                  bookingSubmitting ||
                  serviceCatalogueLoading ||
                  bookingAvailabilityLoading ||
                  Boolean(bookingAvailabilityError) ||
                  Boolean(serviceCatalogueError)
                }
              >
                {bookingSubmitting ? "Scheduling…" : "Schedule appointment"}
              </button>
            </div>
          </form>
        </div>
      )}
      {detailsAppointment && (
        <div
          className="admin-appointment-details-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetailsAppointment(null);
              setDetailsError("");
            }
          }}
        >
          <section
            className="admin-appointment-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-details-title"
          >
            <header className="admin-appointment-details-heading">
              <div>
                <span className="admin-appointment-details-kicker">
                  BOOKING DETAILS · #{detailsAppointment.id}
                </span>
                <h2 id="appointment-details-title">
                  {appointmentName(detailsAppointment)}
                </h2>
                <p>
                  {new Intl.DateTimeFormat("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(
                    new Date(`${detailsAppointment.appointmentDate}T00:00:00`),
                  )}
                  {" · "}
                  {detailsAppointment.startTime ??
                    detailsAppointment.preferredStartTime ??
                    "Time not set"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close booking details"
                onClick={() => {
                  setDetailsAppointment(null);
                  setDetailsError("");
                }}
              >
                <Icon name="close" size={17} />
              </button>
            </header>
            {detailsError && (
              <p className="admin-appointment-details-error" role="alert">
                Could not refresh the booking details: {detailsError}
              </p>
            )}
            {detailsLoading ? (
              <BrandLoader
                variant="compact"
                message="Loading booking details"
              />
            ) : (
              <>
                <dl className="admin-appointment-details-grid">
                  <div>
                    <dt>Client</dt>
                    <dd>{appointmentName(detailsAppointment)}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      {detailsAppointment.customer?.email ??
                        detailsAppointment.email ??
                        "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      {detailsAppointment.customer?.phone ??
                        detailsAppointment.phone ??
                        "Not provided"}
                    </dd>
                  </div>
                  <div>
                    <dt>Appointment status</dt>
                    <dd>
                      {(normalizeAppointmentStatus(detailsAppointment.status) ??
                        "UNKNOWN")
                        .toLowerCase()
                        .replaceAll("_", " ")
                        .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                    </dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>
                      {detailsAppointment.totalDurationMinutes
                        ? `${detailsAppointment.totalDurationMinutes} min`
                        : "Not provided"}
                    </dd>
                  </div>
                </dl>
                <section className="admin-appointment-details-services">
                  <h3>
                    <Icon name="scissors" size={15} />
                    Booked treatments
                  </h3>
                  {detailsAppointment.items?.length ? (
                    <ul>
                      {detailsAppointment.items.map((service) => (
                        <li key={service.id}>
                          <span>
                            <strong>{service.subServiceName}</strong>
                            <small>
                              {service.serviceName}
                              {service.durationMinutes > 0
                                ? ` · ${service.durationMinutes} min`
                                : ""}
                            </small>
                          </span>
                          <strong>{formatPrice(service.totalPrice)}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{appointmentServices(detailsAppointment)}</p>
                  )}
                </section>
                <dl className="admin-appointment-details-totals">
                  <div>
                    <dt>Subtotal</dt>
                    <dd>
                      {detailsAppointment.subtotal !== undefined
                        ? formatPrice(detailsAppointment.subtotal)
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt>Discount</dt>
                    <dd>
                      {detailsAppointment.discount !== undefined
                        ? formatPrice(detailsAppointment.discount)
                        : "—"}
                    </dd>
                  </div>
                  <div className="is-grand-total">
                    <dt>Estimated total</dt>
                    <dd>
                      {formatPrice(appointmentBookedValue(detailsAppointment))}
                    </dd>
                  </div>
                </dl>
                {detailsAppointment.notes && (
                  <div className="admin-appointment-details-notes">
                    <strong>Booking notes</strong>
                    <p>{detailsAppointment.notes}</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
      {toast && (
        <div className="toast-message">
          <span className="toast-check">
            <Icon name="check" size={15} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}
export default AdminDashboard;
