export const WEBMCP_AVAILABILITY_EVENT = "coconut:webmcp:availability";

export type AgentAvailabilityOption = {
  roomType: string;
  name: string;
  units: string[];
  totalThb: number | null;
  priceComplete: boolean;
};

export type AgentAvailabilityNotice = {
  checkIn: string;
  checkOut: string;
  nights: number;
  guestAges: number[];
  options: AgentAvailabilityOption[];
};

export function showAgentAvailabilityNotice(detail: AgentAvailabilityNotice) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AgentAvailabilityNotice>(WEBMCP_AVAILABILITY_EVENT, { detail }));
}
