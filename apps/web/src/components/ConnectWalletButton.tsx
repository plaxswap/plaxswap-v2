import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { PropsWithChildren, useState, useEffect } from 'react'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { ConnectorNames } from 'config/wallet'

const ConnectWalletButton = ({ children, ...props }: PropsWithChildren<ButtonProps>) => {
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  const { open: connectReown } = useWeb3Modal()
  const { isConnected } = useWeb3ModalAccount()

  const [isConnecting, setIsConnecting] = useState(false)
  const [hasLoggedIn, setHasLoggedIn] = useState(false)


  const handleClick = async () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      try {
        setIsConnecting(true)
        await connectReown()
        // Tunggu hook update
        setTimeout(() => {
          if (!hasLoggedIn) {
            login(ConnectorNames.Injected)
            setHasLoggedIn(true)
          }
        }, 500)
      } catch (err) {
        console.error('Connection/Login failed:', err)
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
  }, [isConnected])


  return (
    <>
      <Button onClick={handleClick} variant="primary" disabled={isConnecting} {...props}>
      {isConnecting ? 'Connecting...' : (children || 'Connect Wallet')}
    </Button>
      
    </>
  )
}

export default ConnectWalletButton
