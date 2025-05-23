import { useEffect, useState } from 'react'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { Button } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { ConnectorNames } from 'config/wallet'

const ConnectWalletButton = () => {
  const { open: connectReown } = useWeb3Modal()
  const { isConnected } = useWeb3ModalAccount()
  const { login } = useAuth()
  const handleActive = useActiveHandle()

  const [isConnecting, setIsConnecting] = useState(false)
  const [hasLoggedIn, setHasLoggedIn] = useState(false)

  const handleClick = async () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      setIsConnecting(true)
      try {
        await connectReown()
      } catch (err) {
        console.error(err)
      } finally {
        setIsConnecting(false)
      }
    }
  }

  // login otomatis saat isConnected berubah jadi true
  useEffect(() => {
    if (isConnected && !hasLoggedIn) {
      login(ConnectorNames.Injected)
      setHasLoggedIn(true)
    }
  }, [isConnected, hasLoggedIn])

  return (
    <Button onClick={handleClick} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}

export default ConnectWalletButton
