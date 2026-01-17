import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Facebook({
            clientId: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const z = (await import("zod")).z;
                const bcrypt = (await import("bcryptjs")).default;

                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email }) {
            // Allow sign in for OAuth providers
            if (account?.provider === "google" || account?.provider === "facebook") {
                // Check if a user with this email already exists
                if (user.email) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        include: { accounts: true },
                    });

                    if (existingUser) {
                        // Check if this OAuth account is already linked
                        const accountExists = existingUser.accounts.some(
                            (acc) => acc.provider === account.provider && acc.providerAccountId === account.providerAccountId
                        );

                        if (!accountExists) {
                            // Link the OAuth account to the existing user
                            await prisma.account.create({
                                data: {
                                    userId: existingUser.id,
                                    type: account.type,
                                    provider: account.provider,
                                    providerAccountId: account.providerAccountId,
                                    access_token: account.access_token,
                                    expires_at: account.expires_at,
                                    id_token: account.id_token,
                                    refresh_token: account.refresh_token,
                                    scope: account.scope,
                                    session_state: account.session_state as string,
                                    token_type: account.token_type,
                                },
                            });
                        }
                        // Update user info if needed
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: {
                                name: user.name || existingUser.name,
                                image: user.image || existingUser.image,
                                emailVerified: existingUser.emailVerified || new Date(),
                            },
                        });
                    }
                }
                return true;
            }
            // Allow credentials provider to proceed normally
            return true;
        },
        async session({ session, user, token }) {
            // Add user ID to session
            if (session.user) {
                // For database sessions (OAuth providers)
                if (user) {
                    session.user.id = user.id;
                }
                // For JWT sessions (credentials provider)
                else if (token?.sub) {
                    session.user.id = token.sub;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            // For credentials provider, add user ID to token
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    events: {
        async createUser({ user }) {
            if (user.email && user.name) {
                try {
                    const { resend, EMAIL_FROM, shouldSendEmail } = await import("@/lib/email/client");
                    const { WelcomeEmail } = await import("@/lib/email/templates/welcome");

                    if (shouldSendEmail()) {
                        await resend.emails.send({
                            from: EMAIL_FROM,
                            to: user.email,
                            subject: "Welcome to eformly!",
                            react: WelcomeEmail({ name: user.name }),
                        });
                        console.log(`[Email] Welcome email sent to ${user.email}`);
                    } else {
                        console.log(`[Email] Skipped welcome email for ${user.email} (Dev/Test mode)`);
                    }
                } catch (error) {
                    console.error("[Email] Failed to send welcome email:", error);
                }
            }
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
})
