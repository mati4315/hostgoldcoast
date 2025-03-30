module.exports = {
  jwt: {
    expiresIn: '30d',
  },
  providers: {
    // Configuración de proveedores de autenticación
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  settings: {
    jwt: {
      expiresIn: '30d',
    },
    cors: {
      enabled: true,
      origin: ['http://localhost:5173', 'http://localhost:3000'], // Ajusta según tu configuración de Vue
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
}; 