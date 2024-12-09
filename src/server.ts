import app from "./app";

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
