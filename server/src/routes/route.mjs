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
import GetLanguageRoute from "./get-language.mjs"
import UserRoute from "./user.mjs"
import MarketPlaceRoute from "./marketplace.mjs"
import ContractsRoute from "./contracts.mjs"
import RazorpayRoute from "./razorpay.mjs"
import NegotiationsRoute from "./negotiations.mjs"
import TransalationRoute from "./transaction.mjs"
import ChatRoute from "./chat.mjs"
import PricePredictor from "./price-prediction.mjs"
import AgentRoute from "./agent-dashboard.mjs"
const router = Router();

router.use(SignUpRoute)
router.use(LoginRoute)
router.use(LogoutRoute)
router.use(GoogleRoute)
router.use(UserRoute);
router.use(HomeRoute)
router.use(AdminDashboardRoute);
router.use(ContactUsRoute)
router.use(ProfileRoute)
router.use(VerificationRoute);
router.use(GetLanguageRoute);
router.use(MarketPlaceRoute);
router.use(ContractsRoute);
router.use(RazorpayRoute);
router.use(NegotiationsRoute);
router.use(TransalationRoute);
router.use(ChatRoute);
router.use(PricePredictor);
router.use(AgentRoute)
export default router;
