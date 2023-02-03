import { useState } from 'react'
import Layout from '../components/layout'
import { useUnlockPaywall } from '../lib/unlock-paywall'
import { useMagic } from '../lib/useMagic';


const Home = () => {
  const [authenticating, setAuthenticating] = useState(false)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('julien.genestoux@gmail.com')
  const { magic } = useMagic()
  const { purchase, status } = useUnlockPaywall(!!magic)

  const login = async (evt) => {
    evt.preventDefault()
    setAuthenticating(true)
    setUser(await magic.auth.loginWithMagicLink({
      email,
    }))
    setAuthenticating(false)
  }

  return (
    <Layout>
      <h1> Unlock + Magic Example</h1>

      <ol>
        <li>Enter an email. Press <code>Submit</code></li>
        <li>
          Complete the MagicLink authentication flow.
        </li>
        <li>
          Click the purchase button. You are now able to checkout <em>with</em> your magic.link account
        </li>
      </ol>

      {authenticating && <p>Authenticating...</p>}

      {!authenticating && !user && <form action='#' onSubmit={login}>
        <input style={{ width: '100%', height: '30px', margin: '5px', padding: '5px' }} type="email" onChange={(evt) => {
          setEmail(evt.target.value)
        }} value={email} /><br />
        <button style={{ width: '100%', height: '30px', margin: '5px', padding: '5px' }} type="submit">Submit</button>
      </form>}

      {!authenticating && user && status === 'ready' && (
        <div>
          <button style={{ width: '100%', height: '30px', margin: '5px', padding: '5px' }} onClick={() => { purchase() }}>Purchase</button>
        </div>
      )}
    </Layout>
  )
}

export default Home
