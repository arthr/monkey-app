import React from "react";
import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import { authRoutes } from "../../modules/auth/routes";
import { remessasRoutes } from "../../modules/remessas/routes";
import Public from "../../modules/layout/Public";


export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas privadas */}
      <Route element={<PrivateRoute />}>
        {remessasRoutes}
      </Route>
      {/* Rotas públicas */}
      <Route element={<Public />}>
        {authRoutes}
      </Route>
    </Routes>
  );
}