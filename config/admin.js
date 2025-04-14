module.exports = ({ env }) => ({
  auth: {
    secret: 'fPSCi1Yn6949buzkgsN8s9oIkpKE8K6aBTc7O9j6rGIXABO9G3laKD4IO1wGkvKKIUi1hiSoEOMaNqDyhJ668Q==',
  },
  apiToken: {
    salt: 'fPSCi1Yn6949buzkgsN8s9oIkpKE8K6aBTc7O9j6rGIXABO9G3laKD4IO1wGkvKKIUi1hiSoEOMaNqDyhJ668Q==',
  },
  transfer: {
    token: {
      salt: 'fPSCi1Yn6949buzkgsN8s9oIkpKE8K6aBTc7O9j6rGIXABO9G3laKD4IO1wGkvKKIUi1hiSoEOMaNqDyhJ668Q==',
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
