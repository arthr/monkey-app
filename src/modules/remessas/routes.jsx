import React from "react";
import { Route } from "react-router-dom";

import Listar from "./pages/Listar";
import Detalhes from "./pages/Detalhes";

export const remessasRoutes = [
    <Route path="/remessas" element={<Listar />} key="remessas-list" />,
    <Route path="/remessas/:filename" element={<Detalhes />} key="remessas-detail" />,
];