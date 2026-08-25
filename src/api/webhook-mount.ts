import { webhookRouter } from "./webhook";
app.use(webhookRouter); // mounted at /webhooks/stripe
