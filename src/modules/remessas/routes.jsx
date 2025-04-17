import React from "react";
import { Route } from "react-router-dom";
// import RemessaList from "./pages/RemessaList";
// import RemessaDetail from "./pages/RemessaDetail";

export const remessasRoutes = [
    //   <Route path="/remessas" element={<RemessaList />} key="remessas-list" />,
    //   <Route path="/remessas/:filename" element={<RemessaDetail />} key="remessas-detail" />,
    <Route path="/remessas" element={<div>Remessas</div>} key="remessas-list" />,
    <Route path="/remessas/:filename" element={<div>Remessa Detail</div>} key="remessas-detail" />,
];