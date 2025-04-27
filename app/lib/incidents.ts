// Types for our incidents system
export interface Comment {
  text: string
  createdBy: {
    id: string
    name: string
  }
  createdAt: string
}

export interface Incident {
  id: string;
  titulo: string;
  descricao: string;
  codigo: string;
  status: string;
  prioridade: string;
  dataCriacao: string;
  dataAtualizacao: string;
  dataFechamento: string;
  comentarios: Comment[];
  usuario?: {
    id: number;
    name: string;
    department?: string;
  };
  tecnico?: {
    id: number;
    name: string;
  };
}

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Map priority to backend format
export function mapPriorityToBackend(priority: string): string {
  switch (priority) {
    case "low":
      return "BAIXA"
    case "medium":
      return "MEDIA"
    case "high":
      return "ALTA"
    case "critical":
      return "CRITICA"
    default:
      return "BAIXA" 
  }
}

// Get all incidents
export async function getAllIncidents(): Promise<Incident[]> {
  const response = await fetch(`${API_BASE_URL}/chamados`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar os chamados");
  }

  return await response.json();
}

// Get incident by ID
export async function getIncidentById(id: string | number) {
  const response = await fetch(`${API_BASE_URL}/chamados/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch incident");
  }

  return response.json();
}

// Create a new incident
export async function createIncident(data: {
  title: string;
  description: string;
  department: string;
  priority: "low" | "medium" | "high" | "critical";
  userId: number;
}) {
  const response = await fetch(`${API_BASE_URL}/chamados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: data.title,
      descricao: data.description,
      departamento: data.department,
      prioridade: mapPriorityToBackend(data.priority),
      usuario: { id: data.userId },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create incident");
  }

  return await response.json();
}

// Update an incident
export async function updateIncident(id: string, updates: Partial<Incident>) {
  const response = await fetch(`${API_BASE_URL}/chamados/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...updates,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update the incident");
  }

  return response.json();
}

// Delete an incident
export async function deleteIncident(id: string) {
  const response = await fetch(`${API_BASE_URL}/chamados/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete the incident");
  }

  return true;
}

// Search incidents
export async function searchIncidents(query: string) {
  const response = await fetch(`${API_BASE_URL}/chamados/buscar?q=${encodeURIComponent(query)}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to search incidents");
  }

  return response.json();
}

// Filter incidents
export async function filterIncidents(filters: {
  status?: string;
  priority?: "low" | "medium" | "high" | "critical";
  department?: string;
}) {
  const queryParams = new URLSearchParams(
    Object.entries({
      status: filters.status,
      prioridade: filters.priority ? mapPriorityToBackend(filters.priority) : undefined,
      departamento: filters.department,
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const response = await fetch(`${API_BASE_URL}/chamados/filtrar?${queryParams}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to filter incidents");
  }

  return response.json();
}
