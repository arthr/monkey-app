import React from "react";
import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import Private from "../../modules/layout/Private";
import Public from "../../modules/layout/Public";

import { authRoutes } from "../../modules/auth/routes";
import { remessasRoutes } from "../../modules/remessas/routes";


export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas privadas */}
      <Route element={<PrivateRoute />}>
        <Route element={<Private />}>
          {remessasRoutes}
        </Route>
      </Route>
      {/* Rotas públicas */}
      <Route element={<Public />}>
        {authRoutes}
      </Route>
    </Routes>
  );
}