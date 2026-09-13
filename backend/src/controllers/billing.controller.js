const Stripe = require("stripe");
const pool = require("../config/db");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const PRICE_BY_PLAN = {
  PRO: process.env.STRIPE_PRO_PRICE_ID,
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

const createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ message: "Stripe is not configured" });
    const { plan = "PRO" } = req.body;
    const price = PRICE_BY_PLAN[plan];
    if (!price) return res.status(400).json({ message: "Unknown plan or missing Stripe price ID" });

    let subscription = await pool.query("SELECT * FROM subscriptions WHERE organization_id=$1", [req.organizationId]);
    let customerId = subscription.rows[0]?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        name: req.organization.name,
        metadata: { organizationId: req.organizationId },
      });
      customerId = customer.id;
      await pool.query(
        `INSERT INTO subscriptions(organization_id,stripe_customer_id,plan,status)
         VALUES($1,$2,'FREE','active')
         ON CONFLICT (organization_id) DO UPDATE SET stripe_customer_id=EXCLUDED.stripe_customer_id, updated_at=NOW()`,
        [req.organizationId, customerId]
      );
      await pool.query("UPDATE organizations SET stripe_customer_id=$1 WHERE id=$2", [customerId, req.organizationId]);
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      success_url: `${frontendUrl}/subscription?success=true`,
      cancel_url: `${frontendUrl}/subscription?cancelled=true`,
      metadata: { organizationId: req.organizationId, plan },
      subscription_data: { metadata: { organizationId: req.organizationId, plan } },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create checkout session" });
  }
};

const getSubscription = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM subscriptions WHERE organization_id=$1", [req.organizationId]);
    res.json(result.rows[0] || { plan: "FREE", status: "active" });
  } catch (error) { console.error(error); res.status(500).json({ message: "Server Error" }); }
};

const handleWebhook = async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).send("Stripe webhook not configured");
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    const data = event.data.object;
    const organizationId = data.metadata?.organizationId;

    if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type) && organizationId) {
      const status = event.type.endsWith("deleted") ? "canceled" : data.status;
      const plan = data.metadata?.plan || "PRO";
      const periodEnd = data.current_period_end ? new Date(data.current_period_end * 1000) : null;
      await pool.query(
        `INSERT INTO subscriptions(organization_id,stripe_customer_id,stripe_subscription_id,stripe_price_id,plan,status,current_period_end)
         VALUES($1,$2,$3,$4,$5,$6,$7)
         ON CONFLICT (organization_id) DO UPDATE SET stripe_customer_id=EXCLUDED.stripe_customer_id,stripe_subscription_id=EXCLUDED.stripe_subscription_id,stripe_price_id=EXCLUDED.stripe_price_id,plan=EXCLUDED.plan,status=EXCLUDED.status,current_period_end=EXCLUDED.current_period_end,updated_at=NOW()`,
        [organizationId, data.customer, data.id, data.items?.data?.[0]?.price?.id || null, plan, status, periodEnd]
      );
      await pool.query("UPDATE organizations SET plan=$1, subscription_status=$2, stripe_customer_id=$3, stripe_subscription_id=$4, updated_at=NOW() WHERE id=$5", [plan, status, data.customer, event.type.endsWith("deleted") ? null : data.id, organizationId]);
    }

    if (event.type === "checkout.session.completed" && data.metadata?.organizationId) {
      await pool.query("UPDATE organizations SET stripe_customer_id=$1 WHERE id=$2", [data.customer, data.metadata.organizationId]);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

module.exports = { createCheckoutSession, getSubscription, handleWebhook };
