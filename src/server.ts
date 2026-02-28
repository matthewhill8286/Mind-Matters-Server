import app from "./app";
import { config } from "./config";

if (config.NODE_ENV !== "production") {
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;
