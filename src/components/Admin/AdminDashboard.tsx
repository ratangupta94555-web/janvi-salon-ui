import React, { useMemo, useState } from "react";
import "./AdminDashboard.css";

type IconName =
  | "grid"
  | "calendar"
  | "users"
  | "scissors"
  | "chart"
  | "settings"
  | "search"
  | "bell"
  | "plus"
  | "arrow"
  | "clock"
  | "check"
  | "more"
  | "sparkle"
  | "chevron"
  | "close"
  | "menu";
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
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
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
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
  };
  return <svg {...common}>{shapes[name]}</svg>;
}

type Appointment = {
  id: number;
  name: string;
  service: string;
  time: string;
  stylist: string;
  color: string;
  initials: string;
  status: "Confirmed" | "Checked in" | "Upcoming";
};
const initialAppointments: Appointment[] = [
  {
    id: 1,
    name: "Sophie Laurent",
    service: "Balayage & gloss",
    time: "9:00 AM",
    stylist: "Isabella",
    color: "lavender",
    initials: "SL",
    status: "Checked in",
  },
  {
    id: 2,
    name: "Maya Chen",
    service: "Signature haircut",
    time: "10:30 AM",
    stylist: "Olivia",
    color: "peach",
    initials: "MC",
    status: "Confirmed" as const,
  },
  {
    id: 3,
    name: "Amara Johnson",
    service: "Gel manicure",
    time: "11:00 AM",
    stylist: "Noah",
    color: "sage",
    initials: "AJ",
    status: "Confirmed" as const,
  },
  {
    id: 4,
    name: "Charlotte Reed",
    service: "Deep conditioning",
    time: "1:30 PM",
    stylist: "Isabella",
    color: "blue",
    initials: "CR",
    status: "Upcoming",
  },
];
const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Appointments", icon: "calendar" },
  { label: "Clients", icon: "users" },
  { label: "Services", icon: "scissors" },
  { label: "Team", icon: "users" },
  { label: "Reports", icon: "chart" },
];

function App() {
  const [page, setPage] = useState("Overview");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [query, setQuery] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState("Today, June 18");
  const [form, setForm] = useState({
    name: "",
    service: "Signature haircut",
    time: "2:00 PM",
    stylist: "Isabella",
  });
  const filteredAppointments = useMemo(
    () =>
      appointments.filter((a) =>
        `${a.name} ${a.service} ${a.stylist}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [appointments, query],
  );
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };
  const createBooking = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    const initials = form.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setAppointments((prev) =>
      [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          service: form.service,
          time: form.time,
          stylist: form.stylist,
          color: "lavender",
          initials,
          status: "Confirmed" as const,
        },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    );
    setBookingOpen(false);
    setForm({
      name: "",
      service: "Signature haircut",
      time: "2:00 PM",
      stylist: "Isabella",
    });
    notify("Your new appointment is booked.");
  };
  const toggleCheckin = (id: number) =>
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === "Checked in" ? "Confirmed" : "Checked in",
            }
          : a,
      ),
    );
  const selectPage = (label: string) => {
    setPage(label);
    setMobileMenu(false);
  };
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <a
          href="#overview"
          className="brand"
          onClick={() => selectPage("Overview")}
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
                <span className="nav-count">8</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Icon name="sparkle" size={17} />
            </div>
            <strong>A little more room?</strong>
            <p>Grow your studio with our Pro plan.</p>
            <button
              onClick={() => notify("You’re on the list — we’ll be in touch!")}
            >
              Explore Pro <Icon name="arrow" size={14} />
            </button>
            <span className="upgrade-orb orb-one" />
            <span className="upgrade-orb orb-two" />
          </div>
          <button
            className="nav-item settings-link"
            onClick={() => selectPage("Settings")}
          >
            <Icon name="settings" />
            <span>Settings</span>
          </button>
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
            <label className="search-box">
              <Icon name="search" size={17} />
              <input
                aria-label="Search appointments"
                placeholder="Search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>
            <div className="notice-wrap">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                onClick={() => setNoticeOpen(!noticeOpen)}
              >
                <Icon name="bell" />
                <i />
              </button>
              {noticeOpen && (
                <div className="notice-popover">
                  <strong>You’re all caught up</strong>
                  <p>Your latest studio updates will show up here.</p>
                </div>
              )}
            </div>
            <button
              className="top-avatar"
              onClick={() => notify("Profile settings opened")}
            >
              JL
            </button>
          </div>
        </header>
        <div className="page-wrap">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot" /> WEDNESDAY, JUNE 18, 2025
              </div>
              <h1>
                {page === "Overview" ? (
                  <>
                    Good morning, Jamie <span className="wave">✳</span>
                  </>
                ) : (
                  page
                )}
              </h1>
              <p className="welcome-subtitle">
                {page === "Overview"
                  ? "Here’s what’s happening at your studio today."
                  : `Your ${page.toLowerCase()} at a glance.`}
              </p>
            </div>
            <div className="welcome-actions">
              <div className="date-picker">
                <Icon name="calendar" size={16} />
                <select
                  aria-label="Select date"
                  value={dateLabel}
                  onChange={(e) => setDateLabel(e.target.value)}
                >
                  <option>Today, June 18</option>
                  <option>Tomorrow, June 19</option>
                  <option>This week</option>
                </select>
                <Icon name="chevron" size={14} />
              </div>
              <button
                className="primary-button"
                onClick={() => setBookingOpen(true)}
              >
                <Icon name="plus" size={17} /> New appointment
              </button>
            </div>
          </div>
          {page === "Overview" ? (
            <>
              <section className="stats-grid" aria-label="Studio statistics">
                <article className="stat-card">
                  <div className="stat-heading">
                    TODAY’S APPOINTMENTS{" "}
                    <span className="stat-icon lilac">
                      <Icon name="calendar" size={17} />
                    </span>
                  </div>
                  <div className="stat-value">
                    24{" "}
                    <span className="stat-change positive">
                      <Icon name="arrow" size={13} /> 12%
                    </span>
                  </div>
                  <div className="stat-note">
                    vs. 21 appointments last Wednesday
                  </div>
                  <div className="sparkline spark-purple">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-heading">
                    TODAY’S REVENUE{" "}
                    <span className="stat-icon green">
                      <span className="currency">₹</span>
                    </span>
                  </div>
                  <div className="stat-value">
                    ₹2,72,700{" "}
                    <span className="stat-change positive">
                      <Icon name="arrow" size={13} /> 8.4%
                    </span>
                  </div>
                  <div className="stat-note">
                    vs. ₹2,51,600 average daily revenue
                  </div>
                  <div className="sparkline spark-green">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-heading">
                    NEW CLIENTS{" "}
                    <span className="stat-icon peach">
                      <Icon name="users" size={17} />
                    </span>
                  </div>
                  <div className="stat-value">
                    18{" "}
                    <span className="stat-change positive">
                      <Icon name="arrow" size={13} /> 4.2%
                    </span>
                  </div>
                  <div className="stat-note">
                    This month · 6 returning this week
                  </div>
                  <div className="mini-avatars">
                    <span className="mini-avatar av-a">M</span>
                    <span className="mini-avatar av-b">S</span>
                    <span className="mini-avatar av-c">A</span>
                    <span className="mini-avatar av-d">+</span>
                    <small>and 14 more</small>
                  </div>
                </article>
                <article className="stat-card">
                  <div className="stat-heading">
                    CLIENT RETENTION{" "}
                    <span className="stat-icon blue">
                      <Icon name="chart" size={17} />
                    </span>
                  </div>
                  <div className="stat-value">
                    84.6%{" "}
                    <span className="stat-change positive">
                      <Icon name="arrow" size={13} /> 2.1%
                    </span>
                  </div>
                  <div className="stat-note">Looking lovely this month ✨</div>
                  <div className="retention-bar">
                    <span />
                  </div>
                </article>
              </section>
              <section className="feature-row">
                <article className="appointments-card panel">
                  <div className="panel-header">
                    <div>
                      <h2>
                        Today’s appointments{" "}
                        <span className="count-pill">
                          {appointments.length}
                        </span>
                      </h2>
                      <p>Your studio schedule at a glance</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => selectPage("Appointments")}
                    >
                      View calendar <Icon name="arrow" size={14} />
                    </button>
                  </div>
                  <div className="appointment-list">
                    {filteredAppointments.slice(0, 4).map((item) => (
                      <div className="appointment-row" key={item.id}>
                        <div className="appointment-time">
                          <strong>{item.time.split(" ")[0]}</strong>
                          <small>{item.time.split(" ")[1]}</small>
                        </div>
                        <span className={`client-avatar ${item.color}`}>
                          {item.initials}
                        </span>
                        <div className="appointment-info">
                          <strong>{item.name}</strong>
                          <span>
                            {item.service} <i>·</i> {item.stylist}
                          </span>
                        </div>
                        <span
                          className={`status-pill ${item.status.toLowerCase().replace(" ", "-")}`}
                        >
                          {item.status === "Checked in" && <span />}
                          {item.status}
                        </span>
                        <button
                          className="row-more"
                          aria-label={`Check in ${item.name}`}
                          title="Toggle check in"
                          onClick={() => toggleCheckin(item.id)}
                        >
                          <Icon name="more" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    className="schedule-footer"
                    onClick={() => selectPage("Appointments")}
                  >
                    <Icon name="clock" size={15} /> 20 more appointments today{" "}
                    <Icon name="chevron" size={14} />
                  </button>
                </article>
                <article className="performance-card panel">
                  <div className="panel-header">
                    <div>
                      <h2>Studio performance</h2>
                      <p>Revenue overview</p>
                    </div>
                    <select
                      className="period-select"
                      aria-label="Performance period"
                    >
                      <option>This week</option>
                      <option>This month</option>
                    </select>
                  </div>
                  <div className="chart-total">
                    <strong>₹12,17,700</strong>
                    <span className="stat-change positive">
                      <Icon name="arrow" size={13} /> 12.8%
                    </span>
                  </div>
                  <div className="chart-caption">
                    Total revenue <span>compared to last week</span>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-y-labels">
                      <span>₹3.84L</span>
                      <span>₹2.88L</span>
                      <span>₹1.92L</span>
                      <span>₹96,000</span>
                    </div>
                    <div className="chart-area">
                      <div className="chart-gridlines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <svg
                        viewBox="0 0 390 126"
                        preserveAspectRatio="none"
                        className="revenue-chart"
                        aria-label="Revenue chart"
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
                          d="M0,96 C20,89 35,91 56,77 S88,70 111,77 S146,82 166,54 S199,56 221,48 S252,60 277,39 S310,45 331,24 S365,33 390,10 V126 H0Z"
                          fill="url(#chartFill)"
                        />
                        <path
                          d="M0,96 C20,89 35,91 56,77 S88,70 111,77 S146,82 166,54 S199,56 221,48 S252,60 277,39 S310,45 331,24 S365,33 390,10"
                          fill="none"
                          stroke="#8f70ce"
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <circle
                          cx="277"
                          cy="39"
                          r="4"
                          fill="#fff"
                          stroke="#8f70ce"
                          strokeWidth="2"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      <div className="chart-x-labels">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <span />
                    <i>Revenue</i>
                    <small>Daily total</small>
                  </div>
                </article>
              </section>
              <section className="bottom-row">
                <article className="popular-card panel">
                  <div className="panel-header">
                    <div>
                      <h2>Popular services</h2>
                      <p>Your top performers this month</p>
                    </div>
                    <button
                      className="plain-icon-button"
                      aria-label="More service options"
                      onClick={() => notify("Service options")}
                    >
                      <Icon name="more" />
                    </button>
                  </div>
                  <div className="service-list">
                    <div className="service-row">
                      <span className="service-symbol service-purple">
                        <Icon name="scissors" />
                      </span>
                      <span className="service-details">
                        <strong>Signature haircut</strong>
                        <small>Hair · 45 min</small>
                      </span>
                      <span className="service-bookings">
                        86 <small>bookings</small>
                      </span>
                      <span className="service-revenue">₹7,43,300</span>
                      <span className="service-trend">↗ 18%</span>
                    </div>
                    <div className="service-row">
                      <span className="service-symbol service-peach">
                        <Icon name="sparkle" />
                      </span>
                      <span className="service-details">
                        <strong>Balayage & gloss</strong>
                        <small>Color · 2 hr 30 min</small>
                      </span>
                      <span className="service-bookings">
                        42 <small>bookings</small>
                      </span>
                      <span className="service-revenue">₹6,04,300</span>
                      <span className="service-trend">↗ 12%</span>
                    </div>
                    <div className="service-row">
                      <span className="service-symbol service-green">
                        <Icon name="sparkle" />
                      </span>
                      <span className="service-details">
                        <strong>Gel manicure</strong>
                        <small>Nails · 1 hr</small>
                      </span>
                      <span className="service-bookings">
                        68 <small>bookings</small>
                      </span>
                      <span className="service-revenue">₹4,57,100</span>
                      <span className="service-trend">↗ 8%</span>
                    </div>
                  </div>
                </article>
                <article className="team-card panel">
                  <div className="panel-header">
                    <div>
                      <h2>
                        Your team <span className="count-pill">4</span>
                      </h2>
                      <p>On the floor today</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => selectPage("Team")}
                    >
                      View team <Icon name="arrow" size={14} />
                    </button>
                  </div>
                  <div className="team-list">
                    <div className="team-row">
                      <span className="team-photo stylist-one">IS</span>
                      <span className="team-details">
                        <strong>Isabella Santos</strong>
                        <small>Senior stylist</small>
                      </span>
                      <span className="online-dot" />
                      <span className="team-clients">6 clients</span>
                    </div>
                    <div className="team-row">
                      <span className="team-photo stylist-two">OK</span>
                      <span className="team-details">
                        <strong>Olivia Kim</strong>
                        <small>Color specialist</small>
                      </span>
                      <span className="online-dot" />
                      <span className="team-clients">4 clients</span>
                    </div>
                    <div className="team-row">
                      <span className="team-photo stylist-three">NB</span>
                      <span className="team-details">
                        <strong>Noah Bennett</strong>
                        <small>Nail artist</small>
                      </span>
                      <span className="online-dot away" />
                      <span className="team-clients">3 clients</span>
                    </div>
                  </div>
                </article>
              </section>
            </>
          ) : (
            <section className="section-page panel">
              <div className="panel-header">
                <div>
                  <h2>
                    {page}{" "}
                    <span className="count-pill">
                      {page === "Appointments"
                        ? appointments.length
                        : page === "Clients"
                          ? 248
                          : page === "Services"
                            ? 12
                            : page === "Team"
                              ? 4
                              : 6}
                    </span>
                  </h2>
                  <p>Manage your studio {page.toLowerCase()} in one place.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() =>
                    page === "Appointments"
                      ? setBookingOpen(true)
                      : notify(
                          `Add ${page.slice(0, -1).toLowerCase()} flow opened`,
                        )
                  }
                >
                  <Icon name="plus" size={16} /> Add{" "}
                  {page === "Appointments"
                    ? "appointment"
                    : page.slice(0, -1).toLowerCase()}
                </button>
              </div>
              {page === "Appointments" ? (
                <div className="appointment-list expanded-list">
                  {filteredAppointments.map((item) => (
                    <div className="appointment-row" key={item.id}>
                      <div className="appointment-time">
                        <strong>{item.time.split(" ")[0]}</strong>
                        <small>{item.time.split(" ")[1]}</small>
                      </div>
                      <span className={`client-avatar ${item.color}`}>
                        {item.initials}
                      </span>
                      <div className="appointment-info">
                        <strong>{item.name}</strong>
                        <span>
                          {item.service} <i>·</i> {item.stylist}
                        </span>
                      </div>
                      <span
                        className={`status-pill ${item.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {item.status}
                      </span>
                      <button
                        className="row-more"
                        onClick={() => toggleCheckin(item.id)}
                        aria-label="Toggle check in"
                      >
                        <Icon name="check" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="placeholder-grid">
                  {(page === "Clients"
                    ? [
                        ["Maya Chen", "Last visit · Jun 16", "MC"],
                        ["Sophie Laurent", "Last visit · Jun 12", "SL"],
                        ["Amara Johnson", "Last visit · Jun 11", "AJ"],
                        ["Charlotte Reed", "Last visit · Jun 10", "CR"],
                        ["Lily Parker", "Last visit · Jun 8", "LP"],
                        ["Elena Rivera", "Last visit · Jun 7", "ER"],
                      ]
                    : page === "Team"
                      ? [
                          ["Isabella Santos", "Senior stylist", "IS"],
                          ["Olivia Kim", "Color specialist", "OK"],
                          ["Noah Bennett", "Nail artist", "NB"],
                          ["Ava Patel", "Esthetician", "AP"],
                        ]
                      : page === "Services"
                        ? [
                            ["Signature haircut", "Hair · 45 min", "₹8,600"],
                            ["Balayage & gloss", "Color · 2 hr 30 min", "₹14,400"],
                            ["Gel manicure", "Nails · 1 hr", "₹6,700"],
                            ["Deep conditioning", "Treatment · 45 min", "₹8,200"],
                            ["Blowout", "Styling · 45 min", "₹6,200"],
                            ["Brow shaping", "Beauty · 30 min", "₹3,800"],
                          ]
                        : [
                            ["Weekly revenue", "₹12,17,700", "↗"],
                            ["Appointments", "164 this week", "↗"],
                            ["New clients", "18 this month", "↗"],
                            ["Retention", "84.6%", "↗"],
                            ["Popular service", "Signature haircut", "86"],
                            ["Team utilization", "78%", "↗"],
                          ]
                  ).map((entry, index) => (
                    <div className="placeholder-item" key={index}>
                      <span
                        className={`client-avatar ${["lavender", "peach", "sage", "blue"][index % 4]}`}
                      >
                        {page === "Services" ? (
                          <Icon name="scissors" size={18} />
                        ) : (
                          entry[2]
                        )}
                      </span>
                      <div>
                        <strong>{entry[0]}</strong>
                        <small>{entry[1]}</small>
                      </div>
                      <span className="placeholder-end">
                        {page === "Services" ? (
                          entry[2]
                        ) : (
                          <Icon name="chevron" size={16} />
                        )}
                      </span>
                    </div>
                  ))}
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
          className="modal-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setBookingOpen(false);
          }}
        >
          <form className="booking-modal" onSubmit={createBooking}>
            <div className="modal-top">
              <div className="modal-icon">
                <Icon name="calendar" size={20} />
              </div>
              <button
                type="button"
                className="plain-icon-button"
                onClick={() => setBookingOpen(false)}
                aria-label="Close"
              >
                <Icon name="close" />
              </button>
            </div>
            <h2>Book an appointment</h2>
            <p>Add a new visit to your studio schedule.</p>
            <label>
              Client name
              <input
                required
                placeholder="e.g. Taylor Morgan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              Service
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
              >
                <option>Signature haircut</option>
                <option>Balayage & gloss</option>
                <option>Gel manicure</option>
                <option>Deep conditioning</option>
                <option>Blowout</option>
              </select>
            </label>
            <div className="form-split">
              <label>
                Date
                <select defaultValue="Today, June 18">
                  <option>Today, June 18</option>
                  <option>Tomorrow, June 19</option>
                </select>
              </label>
              <label>
                Time
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                >
                  <option>12:00 PM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                  <option>5:00 PM</option>
                </select>
              </label>
            </div>
            <label>
              Stylist
              <select
                value={form.stylist}
                onChange={(e) => setForm({ ...form, stylist: e.target.value })}
              >
                <option>Isabella</option>
                <option>Olivia</option>
                <option>Noah</option>
                <option>Ava</option>
              </select>
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setBookingOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                <Icon name="check" size={16} /> Confirm booking
              </button>
            </div>
          </form>
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
export default App;



