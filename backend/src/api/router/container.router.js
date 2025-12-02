import createApbdRouter from "./apbd/apbd.router.js";
// import bankDesaRouter from "./bank-desa/bank-desa.router.js";
// import kasPembantuRouter from "./kas-pembantu/kas-pembantu.router.js";
// import createKasUmumRouter from "./kas-umum/kas-umum.router.js";
// import rabRouter from "./rab/rab.router.js";
import createAuthRouter from "./auth/auth.router.js";

export function initializeRoutes(app, handlers) {

  // auth routes
  app.use('/api/auth', createAuthRouter(handlers.authHandler));

  app.use('/api/apbd', createApbdRouter(handlers.apbdHandler));
  // app.use('/api/bank-desa', bankDesaRouter(handlers.bankDesaHandler));
  // app.use('/api/kas-pembantu', kasPembantuRouter(handlers.kasPembantuHandler));
  // app.use('/api/kas-umum', createKasUmumRouter(handlers.kasUmumHandler));
  // app.use('/api/rab', rabRouter(handlers.rabHandler));
}
