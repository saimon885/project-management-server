import { SUBSCRIPTION_PLANS } from "../../utility/subscription";

type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;

type PaidSubscriptionPlan = Exclude<SubscriptionPlan, "FREE">;
type BillingCycle = "MONTHLY" | "YEARLY";

export interface PaymentCreatePayload {
  plan: PaidSubscriptionPlan;
  billingCycle: BillingCycle;
}
