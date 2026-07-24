"use client";

import { baseUrl } from "@/utils/constants";

// Dummy data for testing the UI without a backend

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const dummyUser = {
  _id: "u1",
  firstName: "Alex",
  lastName: "Developer",
  emailId: "developer@example.com",
  age: 28,
  gender: "male",
  photoUrl:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1500&auto=format&fit=crop",
  about:
    "Full stack developer passionate about React and Node.js. Always building side projects.",
  skills: ["React", "Node.js", "TypeScript", "Next.js", "MongoDB"],
};

const dummyFeed = [
  {
    _id: "f1",
    firstName: "Sarah",
    lastName: "Frontend",
    age: 25,
    gender: "female",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1500&auto=format&fit=crop",
    about: "UI/UX enthusiast. Love making things look pretty.",
    skills: ["CSS", "Figma", "React", "Tailwind"],
  },
  {
    _id: "f2",
    firstName: "John",
    lastName: "Backend",
    age: 30,
    gender: "male",
    photoUrl:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1500&auto=format&fit=crop",
    about: "Database optimizer and API architect. Go and Rust lover.",
    skills: ["Go", "Rust", "PostgreSQL", "Docker"],
  },
  {
    _id: "f3",
    firstName: "Emma",
    lastName: "Fullstack",
    age: 27,
    gender: "female",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1500&auto=format&fit=crop",
    about: "Building scalable web apps. Looking for a co-founder.",
    skills: ["Vue", "Python", "Django", "AWS"],
  },
];

const dummyConnections = [
  {
    _id: "c1",
    firstName: "David",
    lastName: "DevOps",
    age: 32,
    gender: "male",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1500&auto=format&fit=crop",
    about: "CI/CD pipelines all day.",
    skills: ["Kubernetes", "Jenkins", "AWS", "Terraform"],
  },
];

const dummyRequests = [
  {
    _id: "r1",
    fromUserId: {
      _id: "r1_u",
      firstName: "Mike",
      lastName: "Mobile",
      age: 24,
      gender: "male",
      photoUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1500&auto=format&fit=crop",
      about: "Flutter and React Native developer. Let's build an app together!",
      skills: ["Flutter", "Dart", "React Native", "iOS", "Android"],
    },
    status: "interested",
  },
];

const checkAuth = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false;
};

export const authApi = {
  login: async (credentials: any) => {
    await delay(800);
    if (credentials.emailId && credentials.password) {
      localStorage.setItem("isLoggedIn", "true");
      return { data: { message: "Login successful!" } };
    }
    throw { response: { data: { message: "Invalid credentials" } } };
  },
  signup: async (data: any) => {
    await delay(800);
    return { data: { message: "Signup successful" } };
  },
  logout: async () => {
    const axios = (await import("axios")).default;
    return await axios.post(`${baseUrl}/logout`, {});
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
    await delay(800);
    const savedUser = localStorage.getItem("dummyUser");
    const currentUser = savedUser ? JSON.parse(savedUser) : dummyUser;
    const updated = { ...currentUser, ...data };
    localStorage.setItem("dummyUser", JSON.stringify(updated));
    return { data: { data: updated } };
  },
  updatePassword: async (data: any) => {
    await delay(800);
    return { data: { message: "Password updated" } };
  },
};

export const requestApi = {
  send: async (status: "interested" | "ignored", toUserId: string) => {
    await delay(500);
    return { data: { message: "Request sent" } };
  },
  review: async (status: "accepted" | "rejected", requestId: string) => {
    await delay(500);
    return { data: { message: "Request reviewed" } };
  },
};

export const userApi = {
  feed: async (page = 1, limit = 10) => {
    await delay(800);
    if (!checkAuth()) throw { response: { status: 401 } };
    const start = (page - 1) * limit;
    const end = start + limit;
    return { data: { feed: dummyFeed.slice(start, end) } };
  },
  connections: async () => {
    await delay(600);
    if (!checkAuth()) throw { response: { status: 401 } };
    return { data: { connections: dummyConnections } };
  },
  requestsReceived: async () => {
    await delay(600);
    if (!checkAuth()) throw { response: { status: 401 } };
    return { data: { connectioRequests: dummyRequests } };
  },
};
