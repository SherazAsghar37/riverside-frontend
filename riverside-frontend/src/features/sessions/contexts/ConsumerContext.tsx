import useConsumerManager from "@/services/ConsumerManager";
import { createContext, useContext } from "react";
import { useWebSocketHandler } from "../hooks/useSocketHandler";

const ConsumerContext = createContext(null);

const ConsumerProvider = ({ children }: { children: React.ReactNode }) => {
  const consumerManager = useConsumerManager();

  return (
    <ConsumerContext.Provider value={consumerManager}>
      {children}
    </ConsumerContext.Provider>
  );
};

const useConsumerContext = () => {
  const context = useContext(ConsumerContext);
  if (context === undefined) {
    throw new Error(
      "useConsumerContext must be used within a ConsumerProvider"
    );
  }
  return context;
};

export default ConsumerProvider;
export { useConsumerContext };
