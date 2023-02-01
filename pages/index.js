import { Magic } from 'magic-sdk';
import { useState } from 'react'
import Layout from '../components/layout'
import { ethers } from 'ethers'
import { useUnlockPaywall } from '../lib/unlock-paywall'
import { useEffect } from 'react'

const Home = () => {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('julien.genestoux@gmail.com')
  const { purchase } = useUnlockPaywall()

  const login = async (evt) => {
    evt.preventDefault()

    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      network: {
        rpcUrl: 'https://rpc.unlock-protocol.com/5',
        chainId: 5
      }
    })

    const didToken = await magic.auth.loginWithMagicLink({
      email,
    })

    const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = ethers.utils.formatEther(
      await provider.getBalance(userAddress), // Balance is in wei
    );
    console.log({ address, balance })

  }

  return (
    <Layout>
      <h1> Unlock + Magic Example</h1>

      <ol>
        <li>Enter an email.</li>
        <li>
          You'll be redirected to Home. Then, click on the purchase button
        </li>
        <li>
          You are "logged in" inside of the checkout modal as the magic.link user.
        </li>
      </ol>

      {!user && <form action='#' onSubmit={login}>
        <input type="email" onChange={(evt) => {
          setEmail(evt.target.value)
        }} value={email} />
        <button type="submit">Submit</button>
      </form>}

      {user && (
        <button onClick={() => { purchase() }}>Purchase</button>
      )}
    </Layout>
  )
}

export default Home
