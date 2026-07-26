"use client";

import { baseUrl } from "@/utils/constants";

export const authApi = {
  login: async (credentials: any) => {
    const axios = (await import("axios")).default;
    return await axios.post(`${baseUrl}/login`, credentials, {
      withCredentials: true,
    });
  },
  signup: async (data: any) => {
    const axios = (await import("axios")).default;
    return await axios.post(`${baseUrl}/signup`, data, {
      withCredentials: true,
    });
  },
  logout: async () => {
    const axios = (await import("axios")).default;
    return await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });
  },
};

export const profileApi = {
  view: async () => {
    const axios = (await import("axios")).default;
    return await axios.get(`${baseUrl}/profile/view`, {
      withCredentials: true,
    });
  },
  edit: async (data: any) => {
    const axios = (await import("axios")).default;
    return await axios.patch(`${baseUrl}/profile/edit`, data, {
      withCredentials: true,
    });
  },
  updatePassword: async (data: any) => {
    const axios = (await import("axios")).default;
    return await axios.patch(`${baseUrl}/profile/updatePassword`, data, {
      withCredentials: true,
    });
  },
};

export const requestApi = {
  send: async (status: "interested" | "ignored", toUserId: string) => {
    const axios = (await import("axios")).default;
    return await axios.post(
      `${baseUrl}/request/send/${status}/${toUserId}`,
      {},
      { withCredentials: true }
    );
  },
  review: async (status: "accepted" | "rejected", requestId: string) => {
    const axios = (await import("axios")).default;
    return await axios.post(
      `${baseUrl}/request/review/${status}/${requestId}`,
      {},
      { withCredentials: true }
    );
  },
};

export const userApi = {
  feed: async (page = 1, limit = 10) => {
    const axios = (await import("axios")).default;
    return await axios.get(`${baseUrl}/feed`, {
      params: { page, limit },
      withCredentials: true,
    });
  },
  connections: async () => {
    const axios = (await import("axios")).default;
    return await axios.get(`${baseUrl}/user/connections`, {
      withCredentials: true,
    });
  },
  requestsReceived: async () => {
    const axios = (await import("axios")).default;
    return await axios.get(`${baseUrl}/user/requests/received`, {
      withCredentials: true,
    });
  },
};
