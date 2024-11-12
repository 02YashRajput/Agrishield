import { Router } from "express";
import LoginRoute from "./login.mjs"
import SignUpRoute from "./sign-up.mjs" 
import LogoutRoute from "./logout.mjs"
import GoogleRoute from "./google-auth.mjs"
import HomeRoute from "./home.mjs"
import ContactUsRoute from "./contact-us.mjs"
import ProfileRoute from "./profile.mjs"
import AdminDashboardRoute from "./admin-dashboard.mjs"
import VerificationRoute from "./verification.mjs"
const router = Router();

router.use(SignUpRoute)
router.use(LoginRoute)
router.use(LogoutRoute)
router.use(GoogleRoute)
router.use(HomeRoute)
router.use(AdminDashboardRoute);
router.use(ContactUsRoute)
router.use(ProfileRoute)
router.use(VerificationRoute);
export default router;
