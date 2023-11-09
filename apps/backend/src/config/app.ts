export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  hostname: process.env.HOSTNAME ?? '0.0.0.0',
  encryption: process.env.ENCRYPTION_KEY ?? '',
  frontend: {
    url: process.env.FRONTEND_URL?.split(',') ?? null,
  },
});
