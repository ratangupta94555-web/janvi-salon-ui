export type ApiSubService = {
  id: number;
  serviceId?: number;
  serviceName?: string;
  name: string;
  description?: string | null;
  price: number;
  offerPrice: number | null;
  durationMinutes: number;
  displayOrder: number;
  active: boolean;
};

export type ApiService = {
  id: number;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
  active: boolean;
  subServices: ApiSubService[];
};

export type ServiceInput = {
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
};

export type SubServiceInput = {
  name: string;
  description: string;
  price: number;
  offerPrice: number | null;
  durationMinutes: number;
  displayOrder: number;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const baseURL = (process.env.REACT_APP_API_URL || "http://localhost:8080").replace(
  /\/+$/,
  "",
);

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { allowRawArray?: boolean; allowRawObject?: boolean } = {},
): Promise<T> {
  const response = await fetch(`${baseURL}${path}`, {
    ...init,
    credentials: "omit",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    if (response.status === 204) {
      return undefined as T;
    }
    throw new ApiRequestError(
      `The API returned an invalid response (HTTP ${response.status}).`,
      response.status,
    );
  }

  const isObject = typeof payload === "object" && payload !== null;
  const envelope = isObject ? (payload as Partial<ApiEnvelope<T>>) : undefined;

  if (!response.ok || envelope?.success === false) {
    throw new ApiRequestError(
      envelope?.message ||
        `The API request failed (HTTP ${response.status}).`,
      response.status,
    );
  }

  if (envelope && "data" in envelope) {
    return envelope.data as T;
  }

  if (options.allowRawArray && Array.isArray(payload)) {
    return payload as T;
  }

  if (
    options.allowRawObject &&
    typeof payload === "object" &&
    payload !== null &&
    !Array.isArray(payload) &&
    !("success" in payload)
  ) {
    return payload as T;
  }

  throw new ApiRequestError(
    "The API response is missing its data.",
    response.status,
  );
}

const jsonBody = (value: unknown): string => JSON.stringify(value);

export const serviceApi = {
  list: (signal?: AbortSignal) =>
    apiRequest<ApiService[]>(
      "/api/services",
      { signal },
      { allowRawArray: true },
    ),

  get: (serviceId: number) =>
    apiRequest<ApiService>(
      `/api/services/${serviceId}`,
      {},
      { allowRawObject: true },
    ),

  create: (input: ServiceInput) =>
    apiRequest<ApiService>(
      "/api/services",
      {
        method: "POST",
        body: jsonBody(input),
      },
      { allowRawObject: true },
    ),

  update: (serviceId: number, input: ServiceInput) =>
    apiRequest<ApiService>(
      `/api/services/${serviceId}`,
      {
        method: "PUT",
        body: jsonBody(input),
      },
      { allowRawObject: true },
    ),

  setStatus: (serviceId: number, active: boolean) =>
    apiRequest<ApiService>(
      `/api/services/${serviceId}/status`,
      {
        method: "PATCH",
        body: jsonBody({ active }),
      },
      { allowRawObject: true },
    ),

  remove: (serviceId: number) =>
    apiRequest<ApiService>(`/api/services/${serviceId}`, { method: "DELETE" }),

  listSubServices: (serviceId: number, signal?: AbortSignal) =>
    apiRequest<ApiSubService[]>(
      `/api/sub-services/service/${serviceId}`,
      { signal },
      { allowRawArray: true },
    ),

  getSubService: (subServiceId: number) =>
    apiRequest<ApiSubService>(
      `/api/sub-services/${subServiceId}`,
      {},
      { allowRawObject: true },
    ),

  createSubService: (serviceId: number, input: SubServiceInput) =>
    apiRequest<ApiSubService>(
      `/api/sub-services/service/${serviceId}`,
      {
        method: "POST",
        body: jsonBody(input),
      },
      { allowRawObject: true },
    ),

  updateSubService: (subServiceId: number, input: SubServiceInput) =>
    apiRequest<ApiSubService>(
      `/api/sub-services/${subServiceId}`,
      {
        method: "PUT",
        body: jsonBody(input),
      },
      { allowRawObject: true },
    ),

  deactivateSubService: (subServiceId: number) =>
    apiRequest<void>(`/api/sub-services/${subServiceId}/deactivate`, {
      method: "PATCH",
    }),

  removeSubService: (subServiceId: number) =>
    apiRequest<void>(`/api/sub-services/${subServiceId}`, {
      method: "DELETE",
    }),
};

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}
