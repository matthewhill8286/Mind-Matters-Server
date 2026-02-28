import app from "../src/app";
import { config } from "../src/config";

if (config.NODE_ENV !== "production") {
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;
