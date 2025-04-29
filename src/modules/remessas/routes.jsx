import React from "react";
import { Route } from "react-router-dom";

import Listar from "./pages/Listar";
import Detalhes from "./pages/Detalhes";

export const remessasRoutes = [
    <Route path="/" element={<Listar />} key="remessas-list" />,
    <Route path="/:filename" element={<Detalhes />} key="remessas-detail" />,
];