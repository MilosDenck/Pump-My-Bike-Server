import User from "../models/user.js";
import asyncHandler from 'express-async-handler';
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { sendEmailVerificationEmail } from "supertokens-node/recipe/emailverification";
import { Sequelize } from '@sequelize/core';
import Session from "supertokens-node/recipe/session";
import { getSession } from "supertokens-node/recipe/session";
import EmailVerification from "supertokens-node/recipe/emailverification";
import EmailVerificationRecipe from "supertokens-node/lib/build/recipe/emailverification/recipe";



import pkg from 'supertokens-node';
const { RecipeUserId } = pkg;

export const createUser = async (username, email, userid) => {
 
    try{
        const exists = await User.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });
        if(exists){
            return
        }
        const timestamp = new Date()
        const user = await User.create({username: username, role: "User", email: email, superTokensID: userid, createdAt: timestamp.toUTCString()})

    }catch(err){
        console.error(err)
        return
    }
    
};

export const sendVerificationEmail = asyncHandler(async (req, res) => {
    try {
        const session = await getSession(req, res, {
            sessionRequired: false,
            overrideGlobalClaimValidators: () => [], // 🔓 E-Mail-verification ignorieren
        });

        if (!session) {
            return res.status(401).json({ error: "No session" });
        }

        const userId = session.getUserId();
        const recipeUserId = new RecipeUserId(userId);


        const result = await EmailVerification.sendEmailVerificationEmail('public', userId, recipeUserId)

        if (result.status === "EMAIL_ALREADY_VERIFIED_ERROR") {
            return res.status(400).json({ error: "Already verified" });
        }

        console.log("Verification mail sent to:", userId);
        return res.json({ status: "OK" });
    } catch (err) {
        console.error("Error sending verification email:", err);
        return res.status(500).json({ error: "Failed to send verification email" });
    }
});

// export const createUser = asyncHandler( async (req, res) => {
//     const {email, password, username} = req.body
//     console.log(req.body, email, password, username)    
    
//     if(!(email && password && username)){
//         res.status(400).send("invalid input")
//     }
//     try {
//         const exists = await User.findOne({
//             where: {
//                 [Sequelize.Op.or]: [
//                     { email: email },
//                     { username: username }
//                 ]
//             }
//         });
//         if(exists){
//             res.status(400).send('Username or Email not available')
//         }
//         const userdata = await EmailPassword.signUp('', email, password);
//         if(userdata.status != 'OK'){
//             res.status(400).send(userdata.status)
//             return
//         }
//         console.log(userdata)
//         const timestamp = new Date()
//         const user = await User.create({username: username, role: "User", email: email, superTokensID: userdata.user.id, createdAt: timestamp.toUTCString()})
//         res.send(user)

//     } catch(err){
//         console.error(err)
//         res.status(500).send("Nutzern Erstellung war nicht erfolgreich")
//     }

// });

export const handleLogin = asyncHandler(async(req, res) => {

    const {email, password, username} = req.body
    
    if(!(email && password && username)){
        res.status(400).send("invalid input")
    }

    try {
        const loginData = await EmailPassword.signIn('public', email, password)
        const session = await Session.createNewSession(req, res, '', loginData.recipeUserId)
        res.send(JSON.stringify({jwt_token: session.getAccessToken(), refrest_token: session.refrest_token}))
    } catch (err) {
        console.error(err)
        res.status(500).send("Login war nicht erfolgreich")
    }
})

export const getUser = asyncHandler(async (req, res) => {
    const session = req.session;

    const userId = session.getUserId();
    try{
        const user = await User.findOne({where: {superTokensID: userId}})

        res.send(user)
    } catch(err){
        console.error(err)
        res.status(400).send("User not Found")
    }
    

})

