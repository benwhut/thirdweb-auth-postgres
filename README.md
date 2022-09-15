## Getting Started


This example demonstrates how to use thirdweb Auth + Next Auth and store your users in a PostgreSQL database using the [Prisma Adapter](https://next-auth.js.org/adapters/prisma).

To run the project, first clone this repository, and then run one of the following commands to install the dependencies:

```bash
yarn install --ignore-engines
```

Create `.env` file with the PostgreSQL database URL. Your PostgreSQL database should be a newly created database with no tables in it. Your `.env` file should look like the following. Note that the `SHADOW_DATABASE_URL` can be the same URL as `DATABASE_URL`.

```
DATABASE_URL=postgres://username:password@domainname:5432/databasename
SHADOW_DATABASE_URL=postgres://username:password@domainname:5432/databasename
```

Run the following commands to create the tables in the database:

```bash
yarn prisma migrate dev
yarn prisma generate
```

Next, you need to create a `.env.local` file and add the `ADMIN_PRIVATE_KEY` variable to it with the private key of the wallet you want to use as the admin wallet to generate and verify payloads. Your file should use something like the following:

```.env.local
NEXT_PUBLIC_DOMAIN_URL=localhost:3000
ADMIN_PRIVATE_KEY=...
```

Additionally, this project demonstrates the use of OAuth providers along with wallet login through the use of Next Auth. In this project, you'll need to set the `GOOGLE_CLIENT_ID` and `GOOGLE_SECRET_ID` variables which you can learn how to configure for Next Auth [here](https://next-auth.js.org/providers/google).

```.env.local
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Finally, you can run the project with the following command:

```bash
yarn dev
```

Now, you can navigate to [http://localhost:3000](http://localhost:3000) to visit the client side page where you can connect a wallet, sign-in with ethereum and view the payload, and use the payload to authenticate with the backend. Each login will be recorded to the PostreSQL database using the Prisma Adapter.

## Issues

In `/api/auth/[...nextauth].ts`, the Google Provider login works as expected (records user to DB and creates the user Session), but the Ethereum wallet address sign-in does not fully work. The Ethereum wallet address sign-in successfully records the wallet address to the PostgreSQL database (done in the `signIn` callback), but it does not create the user Session object to allow the user to see the "secret" message on the client side. The issue is that the `session` callback is not triggered when the sign-in with Ethereum credentials is called, only the `jwt` callback is triggered. Whereas the opposite happens with the Google Provider: the `session` callback is triggered and the `jwt` callback is not. Looking for help to resolve this issue so that both the Next-Auth providers (such as Google) and the Ethereum wallet address sign-in both write the user to the database and creates a session/jwt to indicate the user is signed in.

## Learn More

To learn more about thirdweb and Next Auth, take a look at the following resources:

- [thirdweb Auth Documentation](https://docs.thirdweb.com/auth) - learn about thirdweb Auth.
- [Next Auth Documentation](https://next-auth.js.org/getting-started/introduction) - learn about Next Auth.
- [thirdweb React Documentation](https://docs.thirdweb.com/react) - learn about our React SDK.
- [thirdweb Portal](https://docs.thirdweb.com) - check our guides and development resources.

You can check out [the thirdweb GitHub organization](https://github.com/thirdweb-dev) - your feedback and contributions are welcome!

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
