import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import { SMTPService } from "supertokens-node/recipe/emailpassword/emaildelivery";
import EmailVerification from "supertokens-node/recipe/emailverification"
import { SMTPService as EmailVerificationSMTPService } from "supertokens-node/recipe/emailverification/emaildelivery";
import dotenv from 'dotenv';
import { createUser } from "../controllers/loginController.js";


dotenv.config();

let smtpSettings = {
    host: process.env.EMAIL_HOST,
    password: process.env.EMAIL_PASSWORD,
    port: 587,
    from: {
        name: "Pump My Bike",
        email: process.env.EMAIL_ADDRESS,
    },
    secure: false
}

export const initSuperToken = () => {
    supertokens.init({
        framework: "express",
        supertokens: {
            connectionURI: process.env.SUPERTOKEN_API,
        },
        appInfo: {
            appName: "Pump My Bike",
            apiDomain: process.env.BASE_URL,
            websiteDomain: "http://localhost:3000",
            apiBasePath: "/auth",
            websiteBasePath: "/auth",
        },
        recipeList: [
            EmailPassword.init({
                emailDelivery: {
                    service: new SMTPService({smtpSettings})
                },
                signUpFeature: {
                    formFields: [
                    { id: "username", validate: async (value) => value.length >= 3 ? undefined : "Username zu kurz" },
                    ],
                },
                override: {
                    apis: (originalImplementation) => {
                        return {
                            ...originalImplementation,
                            signUpPOST: async function (input) {
                                const response = await originalImplementation.signUpPOST(input);

                                if (response.status === "OK") {
                                    const id = response.user.id;

                                    const usernameField = input.formFields.find(f => f.id === "username");
                                    const emailField = input.formFields.find(f => f.id === "email");
                                    const username = usernameField?.value ?? "";

                                    const email = emailField?.value ?? "";
                                    await createUser(username, email, id )
                                }
                                return response;
                            },
                        };
                    },
                }
            }),
            Session.init(), 
            EmailVerification.init({
                mode: "REQUIRED",
                emailDelivery: {
                    service: new EmailVerificationSMTPService({smtpSettings})
                }
            }),
        ]
    });
}
