import { Router } from "express";
import LoginRoute from "./login.mjs"
import SignUpRoute from "./sign-up.mjs" 
import GoogleRoute from "./google-auth.mjs"
import HomeRoute from "./home.mjs"
import ContactUsRoute from "./contact-us.mjs"
import ProfileRoute from "./profile.mjs"
import AdminDashboardRoute from "./admin-dashboard.mjs"
const router = Router();

router.use(SignUpRoute)
router.use(LoginRoute)
router.use(GoogleRoute)
router.use(HomeRoute)
router.use(AdminDashboardRoute);
router.use(ContactUsRoute)
router.use(ProfileRoute)
export default router;
