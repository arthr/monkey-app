import React from "react";
import { Route } from "react-router-dom";

import PreVisualizacaoPage from "./pages/PreVisualizacaoPage";

export const nfeRoutes = [
    <Route path="/nfe" element={<PreVisualizacaoPage />} key="nfe-preview" />,
    <Route path="/nfe/pre-visualizacao" element={<PreVisualizacaoPage />} key="nfe-preview-alt" />,
]; 