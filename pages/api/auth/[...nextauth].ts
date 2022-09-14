import GoogleProvider from "next-auth/providers/google"
import { ThirdwebNextAuth } from "@thirdweb-dev/auth/next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { NextAuthHandler, getUser } = ThirdwebNextAuth ({
    // Add the private key we want to use to validate wallet login
    privateKey: process.env.ADMIN_PRIVATE_KEY || "",
    // Configure the domain we want to use for login (must match the domain used on the frontend)
    domain: process.env.NEXT_PUBLIC_DOMAIN_URL,
    // And we can add in any additional next auth configuration we want to use

    nextOptions: {
        adapter: PrismaAdapter(prisma),
        // In this case, we'll enable Google OAuth login as well
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID || "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            }),
        ],

        callbacks: {
            signIn: async ({ user, account, credentials }) => {
                console.log(user)
                console.log(account.provider)
                console.log(credentials)
                
                if (account.provider === "credentials") {
                    const address = user.address
                    console.log("in credentials")

                    // Check is address already exists in DB
                    const addressUser = await prisma?.user.findUnique({
                        where: { address: address.toLowerCase() }
                    })

                    if (!addressUser) {
                        console.log("no user exists")
                        // try {
                        // CREATE
                        const res = await prisma.user.create({
                            data: {
                            address: address.toLowerCase(),
                            }
                        })
                        console.log("user created")
                        //   } catch (error) {
                        //     console.log(error)
                        //   }
                    
                        if (res.error) {
                            console.log(res.error)
                            console.log("IN ERROR")
                            throw new Error("Failed to create user!", res.error)
                        } else {
                            const addressUser = await prisma?.user.findUnique({
                                where: {
                                  address: address.toLowerCase()
                                }
                            })
                            console.log("User found #2")
                            user = addressUser
                            console.log(user)
                            return user
                        }
                    } else {
                        // user exists
                        console.log("user exists")
                        user = addressUser
                        console.log(user)
                        return user
                    }
                } else {
                    console.log("returning user")
                    console.log(typeof(user))
                    console.log(user)
                    return user
                }
            },

            async jwt({ token, user }) {
                // First time jwt callback is run, user object is available
                console.log("in jwt")
                if (user.address) {
                    token.id = user.id
                    token.address = user.address
                }
                return token
            },

            // THIS DOESN'T GET TRIGGERED
            async session({ session, token, user }) {
                console.log("in session")
                // if (token.address) {
                //     session.id = token.id
                //     session.address = token.address
                // }
                return session
            },
        },

        // secret: process.env.NEXTAUTH_SECRET,

        // jwt: {
        //     secret: process.env.NEXTAUTH_SECRET,
        //     encryption: true,
        // },
    },
})

export default NextAuthHandler()
