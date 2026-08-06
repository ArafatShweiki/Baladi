export type HealthData = {
  status: "ok";
  app: "Baladi";
  version: "1.0.0";
  message: "Baladi is running";
  timestamp: string;
};

export function getHealthData(): HealthData {
  return {
    status: "ok",
    app: "Baladi",
    version: "1.0.0",
    message: "Baladi is running",
    timestamp: new Date().toISOString(),
  };
}
