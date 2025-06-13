import RemessasContext from "./RemessasContext";
import { RemessasProvider } from "./RemessasProvider";
import { useContext } from "react";

export { RemessasProvider };
export const useRemessasContext = () => useContext(RemessasContext); 