import React from "react";
import { Route } from "react-router-dom";
import Login from "./pages/Login";

export const authRoutes = [
  <Route path="/login" element={<Login />} key="login" />,
  <Route path="*" element={<div className="text-red-700">404 Not Found</div>} key="not-found" />,
];