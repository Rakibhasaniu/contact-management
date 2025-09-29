import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { ProfileRoutes } from '../modules/Profile/profile.route';


const router = Router();

const moduleRoutes = [
  
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path:'/profile',
    route:ProfileRoutes
  },
  
 
 
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
