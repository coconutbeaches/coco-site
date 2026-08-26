"use client";

import { useEffect } from "react";
import { registerTools } from "@nekuda/webmcp-sdk";
import {
  askSite,
  getAccommodations,
  prepareBookingInquiry,
  searchAvailability,
} from "@/webmcp/tools";

export default function WebmcpRegistrar() {
  useEffect(() => {
    const registration = registerTools([
      askSite,
      getAccommodations,
      searchAvailability,
      prepareBookingInquiry,
    ]);

    return () => registration.unregister();
  }, []);

  return null;
}
