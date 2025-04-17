import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

export function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<PrivateRoute />} />
        {/* Add more routes as needed */}
      </Routes>
  );
}