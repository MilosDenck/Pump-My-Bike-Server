import express from 'express';
import { createUser, handleLogin, getUser, sendVerificationEmail } from '../controllers/loginController.js';
import { verifySession } from "supertokens-node/recipe/session/framework/express";
import Session from "supertokens-node/recipe/session";


const router = express.Router();

//router.post('/signup', createUser)
router.post('/auth/login', handleLogin)

router.get("/profile", verifySession(), getUser)

router.get("/verify/resend", sendVerificationEmail )

router.get("/verify/session", verifySession(), async (req, res) => {
    res.json({ status: "OK" });
})

router.get('/refresh', async (req, res) => {
    try{
        let session = await Session.refreshSession(req, res)
        res.send("success")
    } catch(err) {
        console.error(err)
        res.status(500).send('could not refresh session')
    }
    


})

export default router;