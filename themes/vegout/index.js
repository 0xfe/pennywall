// eslint-disable-next-line
quid.autoInit({
  apiKey: '{{apiKey}}',
  onPaymentSuccess() {
    window.location.replace('{{destination.url}}');
  },
});
