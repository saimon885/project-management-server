export const SUBSCRIPTION_PLANS = {
  FREE: {
    invitationLimit: 3,
    monthlyPrice: 0,
    yearlyPrice: 0,
  },

  PRO: {
    invitationLimit: 20,
    monthlyPrice: 999,
    yearlyPrice: 9990,
  },

  BUSINESS: {
    invitationLimit: 100,
    monthlyPrice: 2499,
    yearlyPrice: 24990,
  },
} as const;

export const BILLING_CYCLE = {
  MONTHLY: 1,
  YEARLY: 12,
} as const;
