import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { PropsWithChildren } from 'react'
import { ConnectorNames } from 'config/wallet'

const ConnectWalletButton = ({ children, ...props }: PropsWithChildren<ButtonProps>) => {
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const { open } = useWeb3Modal()


  const handleReownLogin = async () => {
    await open()
    const { isConnected } = await __NEZHA_BRIDGE__.getAccount()
    if (isConnected) {
      login(ConnectorNames.Injected)
    }
  }

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      try {
        handleReownLogin()
      } finally {
        // do nothing
      }
    }
  }


  return (
      <Button onClick={handleClick} variant="primary">
        {children || t('Connect Wallet')}
      </Button>
  )
}

export default ConnectWalletButton
