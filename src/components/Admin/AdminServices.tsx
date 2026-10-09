import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ApiService,
  ApiSubService,
  formatPrice,
  ServiceInput,
  serviceApi,
  SubServiceInput,
} from "../../api/services";
import BrandLoader from "../common/BrandLoader";
import AdminPagination from "./AdminPagination";
import "./AdminServices.css";

type Props = {
  notify: (message: string) => void;
  view?: "services" | "subServices";
};
type ServiceDraft = {
  name: string;
  description: string;
  icon: string;
  displayOrder: string;
};
type SubServiceDraft = {
  name: string;
  description: string;
  price: string;
  offerPrice: string;
  durationMinutes: string;
  displayOrder: string;
};
type Editor =
  | { type: "service"; service?: ApiService }
  | {
      type: "subService";
      service?: ApiService;
      subService?: ApiSubService;
    };
type DeleteTarget =
  | { type: "service"; service: ApiService }
  | { type: "treatment"; treatment: ApiSubService };
type TreatmentRow = {
  service: ApiService;
  subService?: ApiSubService;
};
type ServiceActionIconName = "edit" | "delete" | "active" | "inactive";

function ServiceActionIcon({ name }: { name: ServiceActionIconName }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  const paths: Record<ServiceActionIconName, React.ReactNode> = {
    edit: (
      <>
        <path d="m14 5 5 5" />
        <path d="M4 20l4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z" />
      </>
    ),
    delete: (
      <>
        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3" />
      </>
    ),
    active: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    inactive: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6m0-6-6 6" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
}

const emptyServiceDraft: ServiceDraft = {
  name: "",
  description: "",
  icon: "",
  displayOrder: "1",
};
const emptySubServiceDraft: SubServiceDraft = {
  name: "",
  description: "",
  price: "",
  offerPrice: "",
  durationMinutes: "30",
  displayOrder: "1",
};

function errorMessage(reason: unknown): string {
  return reason instanceof Error ? reason.message : "The request failed.";
}

function serviceIconGlyph(service: ApiService): string {
  const value = `${service.icon} ${service.name}`.toLowerCase();
  if (value.includes("makeup") || value.includes("makeover")) return "✦";
  if (value.includes("facial") || value.includes("skin")) return "◉";
  if (value.includes("hair")) return "〰";
  if (value.includes("wax") || value.includes("thread")) return "✧";
  if (value.includes("hand") || value.includes("foot") || value.includes("nail"))
    return "❀";
  if (value.includes("mehndi") || value.includes("henna")) return "❋";
  return "✦";
}

export default function AdminServices({
  notify,
  view = "services",
}: Props) {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [serviceDraft, setServiceDraft] =
    useState<ServiceDraft>(emptyServiceDraft);
  const [subServiceDraft, setSubServiceDraft] =
    useState<SubServiceDraft>(emptySubServiceDraft);
  const [editorLoading, setEditorLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionKey, setActionKey] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [serviceStatusFilter, setServiceStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [expandedTreatmentPage, setExpandedTreatmentPage] = useState(1);
  const expandedTreatmentPageSize = 10;
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const reload = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    serviceApi
      .list(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setServices(items);
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") {
          return;
        }
        setError(errorMessage(reason));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [refreshKey]);

  const openServiceEditor = (service?: ApiService) => {
    setEditor({
      type: "service",
      ...(service ? { service } : {}),
    });
    setServiceDraft(
      service
        ? {
            name: service.name,
            description: service.description || "",
            icon: service.icon || "",
            displayOrder: String(service.displayOrder),
          }
        : {
            ...emptyServiceDraft,
            displayOrder: String(
              Math.max(0, ...services.map((item) => item.displayOrder)) + 1,
            ),
          },
    );
  };

  const openSubServiceEditor = async (
    service: ApiService,
    subService?: ApiSubService,
  ) => {
    setEditor({
      type: "subService",
      service,
      ...(subService ? { subService } : {}),
    });
    setSubServiceDraft(
      subService
        ? {
            name: subService.name,
            description: subService.description || "",
            price: String(subService.price),
            offerPrice:
              subService.offerPrice === null
                ? ""
                : String(subService.offerPrice),
            durationMinutes: String(subService.durationMinutes),
            displayOrder: String(subService.displayOrder),
          }
        : {
            ...emptySubServiceDraft,
            displayOrder: String(
              Math.max(0, ...service.subServices.map((item) => item.displayOrder)) +
                1,
            ),
          },
    );
    if (!subService) return;

    setEditorLoading(true);
    try {
      const latest = await serviceApi.getSubService(subService.id);
      setEditor({ type: "subService", service, subService: latest });
      setSubServiceDraft({
        name: latest.name,
        description: latest.description || "",
        price: String(latest.price),
        offerPrice:
          latest.offerPrice === null ? "" : String(latest.offerPrice),
        durationMinutes: String(latest.durationMinutes),
        displayOrder: String(latest.displayOrder),
      });
    } catch (reason) {
      setEditor(null);
      notify(`Could not load treatment details: ${errorMessage(reason)}`);
    } finally {
      setEditorLoading(false);
    }
  };

  const openNewSubServiceEditor = () => {
    if (services.length === 0) {
      notify(
        "A service category is required before adding a treatment. Load or create a service first.",
      );
      return;
    }
    setEditor({ type: "subService" });
    setSubServiceDraft({
      ...emptySubServiceDraft,
      displayOrder: "1",
    });
  };

  const saveEditor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editor) return;
    if (editor.type === "subService" && !editor.service) {
      notify("Select a parent service before saving this treatment.");
      return;
    }
    if (editor.type === "service") {
      if (!serviceDraft.name.trim()) {
        notify("Enter a service name.");
        return;
      }
      const displayOrder = Number(serviceDraft.displayOrder);
      if (!Number.isInteger(displayOrder) || displayOrder < 0) {
        notify("Display order must be a whole number of zero or more.");
        return;
      }
    } else {
      if (!subServiceDraft.name.trim()) {
        notify("Enter a treatment name.");
        return;
      }
      const price = Number(subServiceDraft.price);
      const duration = Number(subServiceDraft.durationMinutes);
      const displayOrder = Number(subServiceDraft.displayOrder);
      if (!Number.isFinite(price) || price < 0) {
        notify("Price must be a valid amount of zero or more.");
        return;
      }
      if (
        subServiceDraft.offerPrice.trim() &&
        (!Number.isFinite(Number(subServiceDraft.offerPrice)) ||
          Number(subServiceDraft.offerPrice) < 0 ||
          Number(subServiceDraft.offerPrice) > price)
      ) {
        notify("Offer price must be between zero and the original price.");
        return;
      }
      if (!Number.isInteger(duration) || duration < 1) {
        notify("Duration must be a whole number greater than zero.");
        return;
      }
      if (!Number.isInteger(displayOrder) || displayOrder < 0) {
        notify("Display order must be a whole number of zero or more.");
        return;
      }
    }
    setSaving(true);
    try {
      if (editor.type === "service") {
        const input: ServiceInput = {
          name: serviceDraft.name.trim(),
          description: serviceDraft.description.trim(),
          icon: serviceDraft.icon.trim(),
          displayOrder: Number(serviceDraft.displayOrder),
        };
        if (editor.service) {
          await serviceApi.update(editor.service.id, input);
          notify("Service updated.");
        } else {
          await serviceApi.create(input);
          notify("Service created.");
        }
      } else {
        const input: SubServiceInput = {
          name: subServiceDraft.name.trim(),
          description: subServiceDraft.description.trim(),
          price: Number(subServiceDraft.price),
          offerPrice: subServiceDraft.offerPrice
            ? Number(subServiceDraft.offerPrice)
            : null,
          durationMinutes: Number(subServiceDraft.durationMinutes),
          displayOrder: Number(subServiceDraft.displayOrder),
        };
        if (editor.subService) {
          await serviceApi.updateSubService(editor.subService.id, input);
          notify("Treatment updated.");
        } else {
          const parentService = editor.service;
          if (!parentService) {
            throw new Error("Select a parent service before saving.");
          }
          await serviceApi.createSubService(parentService.id, input);
          notify("Treatment added.");
        }
      }
      setEditor(null);
      reload();
    } catch (reason) {
      notify(`Could not save changes: ${errorMessage(reason)}`);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const actionId =
      target.type === "service"
        ? `service-${target.service.id}`
        : `treatment-${target.treatment.id}`;
    setActionKey(actionId);
    try {
      if (target.type === "service") {
        await serviceApi.remove(target.service.id);
        notify("Service deleted.");
      } else {
        await serviceApi.removeSubService(target.treatment.id);
        notify("Treatment deleted.");
      }
      setDeleteTarget(null);
      reload();
    } catch (reason) {
      notify(
        target.type === "service"
          ? `Could not delete service: ${errorMessage(reason)}`
          : `Could not delete treatment: ${errorMessage(reason)}`,
      );
    } finally {
      setActionKey("");
    }
  };

  const deleteService = (service: ApiService) =>
    setDeleteTarget({ type: "service", service });

  const deleteSubService = (treatment: ApiSubService) =>
    setDeleteTarget({ type: "treatment", treatment });

  const treatmentCount = services.reduce(
    (total, service) => total + service.subServices.length,
    0,
  );
  const filteredServices = useMemo(() => {
    const query = serviceQuery.trim().toLowerCase();
    return services.filter((service) => {
      const matchesQuery =
        !query ||
        `${service.name} ${service.description} ${service.icon}`
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        serviceStatusFilter === "all" ||
        (serviceStatusFilter === "active" ? service.active : !service.active);
      return matchesQuery && matchesStatus;
    });
  }, [serviceQuery, serviceStatusFilter, services]);
  const filteredTreatmentGroups = useMemo(() => {
    const query = serviceQuery.trim().toLowerCase();
    return services
      .map((service) => {
        const parentMatches = `${service.name} ${service.description}`
          .toLowerCase()
          .includes(query);
        const subServices = service.subServices.filter((subService) => {
          const matchesQuery =
            !query ||
            parentMatches ||
            `${subService.name} ${subService.description || ""}`
              .toLowerCase()
              .includes(query);
          const matchesStatus =
            serviceStatusFilter === "all" ||
            (serviceStatusFilter === "active"
              ? subService.active
              : !subService.active);
          return matchesQuery && matchesStatus;
        });
        return { service, subServices };
      })
      .filter(
        (group) =>
          group.subServices.length > 0 ||
          (!query &&
            serviceStatusFilter === "all" &&
            group.service.subServices.length === 0),
      );
  }, [serviceQuery, serviceStatusFilter, services]);
  const filteredTreatmentRows = useMemo(
    () =>
      filteredTreatmentGroups.flatMap(
        ({ service, subServices }): TreatmentRow[] =>
          subServices.length
            ? subServices.map((subService) => ({ service, subService }))
            : [{ service }],
      ),
    [filteredTreatmentGroups],
  );
  const paginationTotal =
    view === "services" ? filteredServices.length : filteredTreatmentRows.length;
  const pageCount = Math.max(1, Math.ceil(paginationTotal / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const visibleTreatmentRows = filteredTreatmentRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  useEffect(() => {
    setPage(1);
  }, [serviceQuery, serviceStatusFilter, view]);
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    .format(new Date())
    .toUpperCase();

  return (
    <section className="admin-services">
      <header className="admin-services-header">
        <div>
          <span className="admin-services-date">
            <i aria-hidden="true" /> {todayLabel}
          </span>
          <span className="admin-services-eyebrow">
            {view === "services" ? "SERVICE CATALOGUE" : "TREATMENT CATALOGUE"}
          </span>
          <h2>
            <span className="admin-services-title-icon" aria-hidden="true">
              {view === "services" ? "✂" : "✧"}
            </span>
            {view === "services" ? "Services" : "Treatments"}{" "}
            <span className="admin-services-count">
              {view === "services" ? services.length : treatmentCount}
            </span>
          </h2>
          <p>
            {view === "services"
              ? "Manage your service categories, treatments, pricing and availability."
              : "Manage treatments, pricing, duration and availability by service category."}
          </p>
        </div>
        <div className="admin-services-header-actions">
          {view === "services" ? (
            <>
              <span>{treatmentCount} treatments</span>
              <button
                className="admin-service-primary"
                type="button"
                onClick={() => void openServiceEditor()}
              >
                <span aria-hidden="true">＋</span> Add service
              </button>
            </>
          ) : (
            <>
              <span>{services.length} service categories</span>
              <button
                className="admin-service-primary"
                type="button"
                onClick={openNewSubServiceEditor}
              >
                <span aria-hidden="true">＋</span> Add treatment
              </button>
            </>
          )}
        </div>
      </header>

      {error && (
        <div className="admin-service-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={reload}>
            Try again
          </button>
        </div>
      )}
      {loading ? (
        <BrandLoader
          message="Loading service catalogue"
          detail="Gathering your services, treatments and prices."
        />
      ) : services.length === 0 && !error ? (
        <div className="admin-services-empty">
          <span aria-hidden="true">✦</span>
          <h3>
            {view === "services"
              ? "Your catalogue is ready for its first service"
              : "Add a service category before creating treatments"}
          </h3>
          <p>
            {view === "services"
              ? "Add a service category, then add treatments with pricing and duration."
              : "Treatments belong to a service category. Create a service first, then add its treatments here."}
          </p>
          {view === "services" && (
            <button
              className="admin-service-primary"
              type="button"
              onClick={() => void openServiceEditor()}
            >
              Add your first service
            </button>
          )}
        </div>
      ) : (
        view === "services" ? (
          <div className="admin-service-table-panel">
            <div className="admin-service-table-toolbar">
              <label className="admin-service-filter-search">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  aria-label="Search services"
                  placeholder="Search services..."
                  value={serviceQuery}
                  onChange={(event) => setServiceQuery(event.target.value)}
                />
              </label>
              <label className="admin-service-status-filter">
                <span>Status</span>
                <select
                  aria-label="Filter services by status"
                  value={serviceStatusFilter}
                  onChange={(event) =>
                    setServiceStatusFilter(event.target.value)
                  }
                >
                  <option value="all">All services</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <span className="admin-service-result-count">
                {filteredServices.length} of {services.length} services
              </span>
            </div>
            {filteredServices.length ? (
              <>
              <div className="admin-service-table-scroll">
                <table className="admin-service-table">
                  <thead>
                    <tr>
                      <th scope="col">Service</th>
                      <th scope="col">Treatments</th>
                      <th scope="col">Display order</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="admin-service-actions-heading">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleServices.map((service) => {
                      const isExpanded = expandedServiceId === service.id;
                      const currentExpandedTreatmentPage = Math.min(
                        expandedTreatmentPage,
                        Math.max(
                          1,
                          Math.ceil(
                            service.subServices.length /
                              expandedTreatmentPageSize,
                          ),
                        ),
                      );
                      const visibleExpandedTreatments = service.subServices.slice(
                        (currentExpandedTreatmentPage - 1) * expandedTreatmentPageSize,
                        currentExpandedTreatmentPage * expandedTreatmentPageSize,
                      );
                      const serviceIsUpdating =
                        actionKey === `service-${service.id}`;
                      return (
                        <React.Fragment key={service.id}>
                          <tr className="admin-service-table-row">
                            <td>
                              <div className="admin-service-table-identity">
                                <span className="admin-service-icon" aria-hidden="true">
                                  {serviceIconGlyph(service)}
                                </span>
                                <span>
                                  <strong>{service.name}</strong>
                                  <small>
                                    {service.description ||
                                      "No description added."}
                                  </small>
                                </span>
                              </div>
                            </td>
                            <td>
                              <button
                                className="admin-service-treatment-count"
                                type="button"
                                aria-expanded={isExpanded}
                                onClick={() => {
                                  setExpandedTreatmentPage(1);
                                  setExpandedServiceId(
                                    isExpanded ? null : service.id,
                                  );
                                }}
                              >
                                {service.subServices.length}{" "}
                                {service.subServices.length === 1
                                  ? "treatment"
                                  : "treatments"}
                                <span aria-hidden="true">
                                  {isExpanded ? "⌃" : "⌄"}
                                </span>
                              </button>
                            </td>
                            <td>
                              <span className="admin-service-order">
                                #{service.displayOrder}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`admin-service-status admin-service-status-icon ${service.active ? "is-active" : "is-inactive"}`}
                                role="img"
                                aria-label={service.active ? "Active" : "Inactive"}
                                title={service.active ? "Active" : "Inactive"}
                              >
                                <ServiceActionIcon
                                  name={service.active ? "active" : "inactive"}
                                />
                              </span>
                            </td>
                            <td>
                              <div className="admin-service-table-actions">
                                {serviceIsUpdating && (
                                  <BrandLoader
                                    variant="compact"
                                    message="Updating…"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    void openServiceEditor(service)
                                  }
                                  disabled={serviceIsUpdating}
                                  className="is-edit"
                                  aria-label={`Edit ${service.name}`}
                                  title="Edit service"
                                >
                                  <ServiceActionIcon name="edit" />
                                </button>
                                <button
                                  className="is-danger"
                                  type="button"
                                  onClick={() => void deleteService(service)}
                                  disabled={serviceIsUpdating}
                                  aria-label={`Delete ${service.name}`}
                                  title="Delete service"
                                >
                                  <ServiceActionIcon name="delete" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="admin-service-expanded-row">
                              <td colSpan={5}>
                                <div className="admin-service-expanded-content">
                                  <div className="admin-service-expanded-heading">
                                    <div>
                                      <strong>Treatments</strong>
                                      <span>
                                        Treatments available under{" "}
                                        {service.name}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void openSubServiceEditor(service)
                                      }
                                    >
                                      ＋ Add treatment
                                    </button>
                                  </div>
                                  {service.subServices.length ? (
                                    <>
                                    <div className="admin-treatment-table-scroll">
                                      <table className="admin-treatment-table">
                                        <thead>
                                          <tr>
                                            <th scope="col">Treatment</th>
                                            <th scope="col">Duration</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Status</th>
                                            <th scope="col" className="admin-service-actions-heading">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {visibleExpandedTreatments.map(
                                            (subService) => {
                                              const treatmentIsUpdating =
                                                actionKey ===
                                                `treatment-${subService.id}`;
                                              return (
                                                <tr key={subService.id}>
                                                  <td>
                                                    <strong>
                                                      {subService.name}
                                                    </strong>
                                                    {subService.description && (
                                                      <small>
                                                        {subService.description}
                                                      </small>
                                                    )}
                                                  </td>
                                                  <td>
                                                    {
                                                      subService.durationMinutes
                                                    }{" "}
                                                    min
                                                  </td>
                                                  <td>
                                                    <div className="admin-treatment-table-price">
                                                      {subService.offerPrice !==
                                                        null && (
                                                        <del>
                                                          {formatPrice(
                                                            subService.price,
                                                          )}
                                                        </del>
                                                      )}
                                                      <strong>
                                                        {formatPrice(
                                                          subService.offerPrice ??
                                                            subService.price,
                                                        )}
                                                      </strong>
                                                    </div>
                                                  </td>
                                                  <td>
                                                    <span
                                                      className={`admin-service-status admin-service-status-icon ${subService.active ? "is-active" : "is-inactive"}`}
                                                      role="img"
                                                      aria-label={subService.active ? "Active" : "Inactive"}
                                                      title={subService.active ? "Active" : "Inactive"}
                                                    >
                                                      <ServiceActionIcon
                                                        name={subService.active ? "active" : "inactive"}
                                                      />
                                                    </span>
                                                  </td>
                                                  <td className="admin-service-actions-cell">
                                                    <div className="admin-service-table-actions admin-treatment-table-actions">
                                                      {treatmentIsUpdating && (
                                                        <BrandLoader
                                                          variant="compact"
                                                          message="Updating…"
                                                        />
                                                      )}
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          void openSubServiceEditor(
                                                            service,
                                                            subService,
                                                          )
                                                        }
                                                        disabled={
                                                          treatmentIsUpdating
                                                        }
                                                        className="is-edit"
                                                        aria-label={`Edit ${subService.name}`}
                                                        title="Edit treatment"
                                                      >
                                                        <ServiceActionIcon name="edit" />
                                                      </button>
                                                      <button
                                                        className={`admin-treatment-icon-status ${subService.active ? "is-active" : "is-inactive"}`}
                                                        type="button"
                                                        disabled
                                                        aria-label={`Treatment ${subService.name} is ${subService.active ? "active" : "inactive"}`}
                                                        title={subService.active ? "Active" : "Inactive"}
                                                      >
                                                        <ServiceActionIcon
                                                          name={subService.active ? "active" : "inactive"}
                                                        />
                                                      </button>
                                                      <button
                                                        className="is-danger"
                                                        type="button"
                                                        onClick={() =>
                                                          void deleteSubService(
                                                            subService,
                                                          )
                                                        }
                                                        disabled={
                                                          treatmentIsUpdating
                                                        }
                                                        aria-label={`Delete ${subService.name}`}
                                                        title="Delete treatment"
                                                      >
                                                        <ServiceActionIcon name="delete" />
                                                      </button>
                                                    </div>
                                                  </td>
                                                </tr>
                                              );
                                            },
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                    <AdminPagination
                                      currentPage={currentExpandedTreatmentPage}
                                      pageSize={expandedTreatmentPageSize}
                                      totalItems={service.subServices.length}
                                      itemLabel="treatment entries"
                                      onPageChange={setExpandedTreatmentPage}
                                    />
                                    </>
                                  ) : (
                                    <p className="admin-treatment-empty">
                                      No treatments yet. Add one to make this
                                      service bookable.
                                    </p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <AdminPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredServices.length}
                itemLabel="services"
                onPageChange={setPage}
              />
              </>
            ) : (
              <div className="admin-service-filter-empty">
                <strong>No matching services</strong>
                <span>
                  Try a different search or change the status filter.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setServiceQuery("");
                    setServiceStatusFilter("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="admin-service-table-panel">
            <div className="admin-service-table-toolbar">
              <label className="admin-service-filter-search">
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  aria-label="Search treatments"
                  placeholder="Search treatments..."
                  value={serviceQuery}
                  onChange={(event) => setServiceQuery(event.target.value)}
                />
              </label>
              <label className="admin-service-status-filter">
                <span>Status</span>
                <select
                  aria-label="Filter treatments by status"
                  value={serviceStatusFilter}
                  onChange={(event) =>
                    setServiceStatusFilter(event.target.value)
                  }
                >
                  <option value="all">All treatments</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <span className="admin-service-result-count">
                {filteredTreatmentGroups.reduce(
                  (total, group) => total + group.subServices.length,
                  0,
                )}{" "}
                treatments
              </span>
            </div>
            {filteredTreatmentGroups.length ? (
              <>
              <div className="admin-service-table-scroll">
                <table className="admin-subservice-table">
                  <thead>
                    <tr>
                      <th scope="col">Parent service</th>
                      <th scope="col">Treatment</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Price</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="admin-service-actions-heading">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTreatmentRows.map(({ service, subService }, index) =>
                      subService ? (
                        (() => {
                          const updating =
                            actionKey === `treatment-${subService.id}`;
                          return (
                            <tr key={subService.id}>
                              <td>
                                {index === 0 ||
                                visibleTreatmentRows[index - 1]?.service.id !==
                                  service.id ? (
                                  <div className="admin-subservice-parent">
                                    <span className="admin-service-icon" aria-hidden="true">
                                      {serviceIconGlyph(service)}
                                    </span>
                                    <span>
                                      <strong>{service.name}</strong>
                                      <small>
                                        {service.active
                                          ? "Category active"
                                          : "Category inactive"}
                                      </small>
                                    </span>
                                  </div>
                                ) : null}
                              </td>
                              <td>
                                <strong>{subService.name}</strong>
                                <small>
                                  {subService.description || "No description"}
                                </small>
                              </td>
                              <td>{subService.durationMinutes} min</td>
                              <td>
                                <div className="admin-treatment-table-price">
                                  {subService.offerPrice !== null && (
                                    <del>
                                      {formatPrice(subService.price)}
                                    </del>
                                  )}
                                  <strong>
                                    {formatPrice(
                                      subService.offerPrice ??
                                        subService.price,
                                    )}
                                  </strong>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`admin-service-status admin-service-status-icon ${subService.active ? "is-active" : "is-inactive"}`}
                                  role="img"
                                  aria-label={subService.active ? "Active" : "Inactive"}
                                  title={subService.active ? "Active" : "Inactive"}
                                >
                                  <ServiceActionIcon
                                    name={subService.active ? "active" : "inactive"}
                                  />
                                </span>
                              </td>
                              <td className="admin-service-actions-cell">
                                <div className="admin-service-table-actions">
                                  {updating && (
                                    <BrandLoader
                                      variant="compact"
                                      message="Updating…"
                                    />
                                  )}
                                  <button
                                    type="button"
                                    disabled={updating}
                                    onClick={() =>
                                      void openSubServiceEditor(
                                        service,
                                        subService,
                                      )
                                    }
                                    className="is-edit"
                                    aria-label={`Edit ${subService.name}`}
                                    title="Edit treatment"
                                  >
                                    <ServiceActionIcon name="edit" />
                                  </button>
                                  <button
                                    className={`admin-treatment-icon-status ${subService.active ? "is-active" : "is-inactive"}`}
                                    type="button"
                                    disabled
                                    aria-label={`Treatment ${subService.name} is ${subService.active ? "active" : "inactive"}`}
                                    title={subService.active ? "Active" : "Inactive"}
                                  >
                                    <ServiceActionIcon
                                      name={subService.active ? "active" : "inactive"}
                                    />
                                  </button>
                                  <button
                                    className="is-danger"
                                    type="button"
                                    disabled={updating}
                                    onClick={() =>
                                      void deleteSubService(subService)
                                    }
                                    aria-label={`Delete ${subService.name}`}
                                    title="Delete treatment"
                                  >
                                    <ServiceActionIcon name="delete" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })()
                      ) : (
                        <tr key={service.id}>
                          <td>
                            <div className="admin-subservice-parent">
                              <span className="admin-service-icon" aria-hidden="true">
                                {serviceIconGlyph(service)}
                              </span>
                              <span>
                                <strong>{service.name}</strong>
                                <small>
                                  {service.active
                                    ? "Category active"
                                    : "Category inactive"}
                                </small>
                              </span>
                            </div>
                          </td>
                          <td colSpan={4}>
                            No treatments in this category yet.
                          </td>
                          <td>
                            <button
                              className="admin-subservice-add-button"
                              type="button"
                              onClick={() =>
                                void openSubServiceEditor(service)
                              }
                            >
                              ＋ Add treatment
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
              <AdminPagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={filteredTreatmentRows.length}
                itemLabel="treatments"
                onPageChange={setPage}
              />
              </>
            ) : (
              <div className="admin-service-filter-empty">
                <strong>No matching treatments</strong>
                <span>
                  Try a different search or change the status filter.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setServiceQuery("");
                    setServiceStatusFilter("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )
      )}

      {editor && (
        <div
          className="admin-service-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving)
              setEditor(null);
          }}
        >
          <form
            className="admin-service-modal"
            onSubmit={saveEditor}
            aria-busy={editorLoading || saving}
          >
            <div className="admin-service-modal-heading">
              <div>
                <span className="admin-services-eyebrow">
                  {editor.type === "service" ? "SERVICE CATEGORY" : "TREATMENT"}
                </span>
                <h3>
                  {editor.type === "service"
                    ? editor.service
                      ? "Edit service"
                      : "Add service"
                    : editor.subService
                      ? "Edit treatment"
                      : editor.service
                        ? `Add treatment to ${editor.service.name}`
                        : "Add treatment"}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close editor"
                onClick={() => setEditor(null)}
                disabled={saving}
              >
                ×
              </button>
            </div>
            {editorLoading ? (
              <BrandLoader
                variant="compact"
                message="Loading details…"
              />
            ) : editor.type === "service" ? (
              <div className="admin-service-form-grid">
                <label>
                  Service name
                  <input
                    required
                    maxLength={120}
                    value={serviceDraft.name}
                    onChange={(event) =>
                      setServiceDraft({
                        ...serviceDraft,
                        name: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Icon name
                  <input
                    maxLength={40}
                    placeholder="e.g. hair, makeup"
                    value={serviceDraft.icon}
                    onChange={(event) =>
                      setServiceDraft({
                        ...serviceDraft,
                        icon: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="is-wide">
                  Description
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={serviceDraft.description}
                    onChange={(event) =>
                      setServiceDraft({
                        ...serviceDraft,
                        description: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Display order
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={serviceDraft.displayOrder}
                    onChange={(event) =>
                      setServiceDraft({
                        ...serviceDraft,
                        displayOrder: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
            ) : (
              <div className="admin-service-form-grid">
                {!editor.subService && (
                  <label className="is-wide">
                    Parent service
                    <select
                      required
                      value={editor.service?.id ?? ""}
                      onChange={(event) => {
                        const service = services.find(
                          (item) => item.id === Number(event.target.value),
                        );
                        setEditor((current) =>
                          current?.type === "subService"
                            ? { ...current, service }
                            : current,
                        );
                        if (service) {
                          setSubServiceDraft((current) => ({
                            ...current,
                            displayOrder: String(
                              Math.max(
                                0,
                                ...service.subServices.map(
                                  (item) => item.displayOrder,
                                ),
                              ) + 1,
                            ),
                          }));
                        }
                      }}
                    >
                      <option value="" disabled>
                        Select a parent service
                      </option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label className="is-wide">
                  Treatment name
                  <input
                    required
                    maxLength={120}
                    value={subServiceDraft.name}
                    onChange={(event) =>
                      setSubServiceDraft({
                        ...subServiceDraft,
                        name: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Price (₹)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={subServiceDraft.price}
                    onChange={(event) =>
                      setSubServiceDraft({
                        ...subServiceDraft,
                        price: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Offer price (₹)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={subServiceDraft.offerPrice}
                    onChange={(event) =>
                      setSubServiceDraft({
                        ...subServiceDraft,
                        offerPrice: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Duration (minutes)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={subServiceDraft.durationMinutes}
                    onChange={(event) =>
                      setSubServiceDraft({
                        ...subServiceDraft,
                        durationMinutes: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Display order
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={subServiceDraft.displayOrder}
                    onChange={(event) =>
                      setSubServiceDraft({
                        ...subServiceDraft,
                        displayOrder: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="is-wide">
                  Description
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={subServiceDraft.description}
                    onChange={(event) =>
                      setSubServiceDraft({
                        ...subServiceDraft,
                        description: event.target.value,
                      })
                    }
                  />
                </label>
              </div>
            )}
            <div className="admin-service-modal-actions">
              <button
                className="admin-service-cancel"
                type="button"
                onClick={() => setEditor(null)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="admin-service-primary"
                type="submit"
                disabled={saving || editorLoading}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
      {deleteTarget && (
        <div
          className="admin-service-modal-backdrop admin-delete-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              actionKey === ""
            ) {
              setDeleteTarget(null);
            }
          }}
        >
          <section
            className="admin-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="admin-delete-title"
            aria-describedby="admin-delete-description"
          >
            <span className="admin-delete-modal-icon" aria-hidden="true">
              !
            </span>
            <span className="admin-services-eyebrow">CONFIRM DELETION</span>
            <h3 id="admin-delete-title">
              Delete{" "}
              {deleteTarget.type === "service" ? "this service?" : "this treatment?"}
            </h3>
            <p id="admin-delete-description">
              {deleteTarget.type === "service"
                ? `“${deleteTarget.service.name}” and its treatments will be permanently deleted. This action cannot be undone.`
                : `“${deleteTarget.treatment.name}” will be permanently deleted. This action cannot be undone.`}
            </p>
            <div className="admin-delete-modal-actions">
              <button
                className="admin-service-cancel"
                type="button"
                disabled={actionKey !== ""}
                onClick={() => setDeleteTarget(null)}
              >
                Keep it
              </button>
              <button
                className="admin-delete-confirm"
                type="button"
                disabled={actionKey !== ""}
                onClick={() => void confirmDelete()}
              >
                {actionKey !== "" ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
