import { Magic } from 'magic-sdk';
import { useEffect, useState } from 'react'

export const useMagic = () => {
  const [magic, setMagic] = useState(null)

  useEffect(() => {
    const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      network: 'goerli'
    })

    // Important: set the provider to the magic RPC provider
    window.ethereum = magic.rpcProvider
    setMagic(magic)
  }, [])

  return { magic }
}