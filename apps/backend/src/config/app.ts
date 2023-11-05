export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  frontend: {
    url: process.env.FRONTEND_URL?.split(',') ?? null,
  },
});
