import { PropsWithChildren, useEffect, useState } from 'react'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import useAuth from 'hooks/useAuth'
import { ConnectorNames } from 'config/wallet'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'

const ConnectWalletButton = ({ children, ...props }: PropsWithChildren<ButtonProps>) => {
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

  useEffect(() => {
    if (isConnected && !hasLoggedIn) {
      login(ConnectorNames.Injected)
      setHasLoggedIn(true)
    }
  }, [isConnected, hasLoggedIn])

  return (
    <Button onClick={handleClick} disabled={isConnecting} {...props}>
      {isConnecting ? 'Connecting...' : children || 'Connect Wallet'}
    </Button>
  )
}

export default ConnectWalletButton
