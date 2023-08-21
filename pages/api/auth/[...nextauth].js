import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

async function getUserRoleFromDatabase(email) {
  if (email === "thomas.foeldi@gmail.com") {
    return "admin";
  }
  return "viewer";
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // only gets called once when logging in
        token.role = await getUserRoleFromDatabase(user.email);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};
export default NextAuth(authOptions);
