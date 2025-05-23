import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { useAccount, useConnect } from 'wagmi'
import { useEffect, useRef } from 'react'
import { useWeb3Modal } from '@web3modal/ethers5/react'
import { ConnectorNames } from 'config/wallet'
import Trans from './Trans'


const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()

  const { open } = useWeb3Modal()
  const { connector, isConnected } = useAccount()
  const hasLoggedIn = useRef(false)

  const handleClick = async () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      hasLoggedIn.current = false
      await open()
    }
  }

  useEffect(() => {
    const loginIfConnected = async () => {
      if (isConnected && connector && !hasLoggedIn.current) {
        hasLoggedIn.current = true
        try {
          const connectorId = connector.id as ConnectorNames
          const result = await login(connectorId)
          if (!result) {
            console.error('Login failed')
          }
        } catch (err) {
          console.error('Login error', err)
        }
      }
    }

    loginIfConnected()
  }, [isConnected, connector, login])

  return (
    <Button onClick={handleClick} {...props}>
      {children || <Trans>Connect Wallet</Trans>}
    </Button>
  )
}

export default ConnectWalletButton
