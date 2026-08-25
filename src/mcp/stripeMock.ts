export const STRIPE_MOCK = {
  "data": [
    {"id":"pi_1Cus001","amount":4900,"status":"requires_payment_method","last_payment_error":{"code":"card_declined","decline_code":"insufficient_funds"}},
    {"id":"pi_1Cus002","amount":9900,"status":"requires_payment_method","last_payment_error":{"code":"card_declined"}},
    {"id":"pi_1Cus003","amount":14900,"status":"requires_payment_method","last_payment_error":{"code":"card_declined"}},
    {"id":"pi_1Cus004","amount":29900,"status":"requires_payment_method","last_payment_error":{"code":"insufficient_funds"}},
    {"id":"pi_1Cus005","amount":4900,"status":"requires_payment_method","last_payment_error":{"code":"card_declined"}},
    {"id":"pi_1Cus006","amount":19900,"status":"requires_payment_method","last_payment_error":{"code":"card_declined"}},
    {"id":"pi_1Cus007_exp","amount":4900,"status":"requires_payment_method","last_payment_error":{"code":"card_declined","decline_code":"expired_card"}},
    {"id":"pi_1Cus008_exp","amount":9900,"status":"requires_payment_method","last_payment_error":{"code":"expired_card"}},
    {"id":"pi_1Cus011_exp","amount":14900,"status":"requires_payment_method","last_payment_error":{"code":"expired_card"}}
  ]
}
