import {
  useAddress,
  useDisconnect,
  useMetamask,
  useSDK,
} from "@thirdweb-dev/react"
import type { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState, useEffect } from "react"

const Home: NextPage = () => {
  const sdk = useSDK()
  const address = useAddress()
  const connect = useMetamask()
  const disconnect = useDisconnect()
  const { data: session } = useSession()

  const [secret, setSecret] = useState()

  useEffect (() => {
    console.log(session)
  }, [session])

  const getSecret = async () => {
    const res = await fetch("/api/secret")
    const data = await res.json()
    setSecret(data)
  }

  const loginWithWallet = async () => {
    try {
      const domain = process.env.NEXT_PUBLIC_DOMAIN_URL;
      const payload = await sdk?.auth.login(domain);
      await signIn("credentials", { payload: JSON.stringify(payload) });
    } catch (err) {
      throw err
    }
  }

  return (
    <div>
      {session ? (
        <>
          <button onClick={() => signOut()}>Logout</button>
          <pre>User: {JSON.stringify(session)}</pre>
        </>
      ) : (
        <>
          <button onClick={() => signIn("google")}>Login with Google</button>
          {address ? (
            <>
              <button onClick={loginWithWallet}>Login with Wallet</button>
              <button onClick={disconnect}>Disconnect Wallet</button>
              <br />
              <p>Your address: {address}</p>
            </>
          ) : (
            <button onClick={connect}>Connect Wallet</button>
          )}
        </>
      )}

      <br />
      <br />
      <button onClick={getSecret}>Get Secret</button>
      <pre>Secret: {JSON.stringify(secret || null)}</pre>
    </div>
  )
}

export default Home
