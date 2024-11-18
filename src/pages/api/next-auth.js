import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '../../../lib/mongoUtil';
import bcrypt from 'bcryptjs';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const db = await connectToDatabase();
                const user = await db.collection('Users').findOne({ username: credentials.username });

                if (user && await bcrypt.compare(credentials.password, user.password)) {
                    // Returning the user object on successful authentication
                    return { id: user._id, name: user.username, role: user.role };
                } else {
                    throw new Error('Invalid username or password');
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        }
    },
    pages: {
        signIn: '/login/page',  // Custom sign-in page path
        error: '/login/page',   // Error page path
    },
    secret: process.env.SECRET, // Ensure you have a SECRET in your .env.local file
    session: {
        strategy: 'jwt'
    }
});
