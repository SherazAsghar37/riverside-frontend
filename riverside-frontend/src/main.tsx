import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/app/store";
import { enableMapSet } from "immer";
import ConsumerProvider from "./features/sessions/contexts/ConsumerContext";

enableMapSet();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <ConsumerProvider>
        <App />
      </ConsumerProvider>
    </Provider>
  </BrowserRouter>
);
