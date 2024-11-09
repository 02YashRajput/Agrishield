import { Router } from "express";
import LoginRoute from "./login.mjs"
import SignUpRoute from "./sign-up.mjs" 
import GoogleRoute from "./google-auth.mjs"
const router = Router();

router.use(SignUpRoute)
router.use(LoginRoute)
router.use(GoogleRoute)
export default router;
