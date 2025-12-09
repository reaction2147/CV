export const APP_URL = process.env.APP_URL || "http://localhost:3000";

export const STRIPE_PRICE_CV = process.env.STRIPE_PRICE_ID_CV || "";

export const CV_PRICE_GBP = parseFloat(process.env.TAILORMYJOB_CV_PRICE_GBP || "2.99");
export const CV_PRICE_LABEL = `£${CV_PRICE_GBP.toFixed(2)}`;
