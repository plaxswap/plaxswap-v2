import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { PropsWithChildren } from 'react'
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react'
import { ConnectorNames } from 'config/wallet'

const ConnectWalletButton = ({ children, ...props }: PropsWithChildren<ButtonProps>) => {
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  const { open: connectReown } = useWeb3Modal()
  const { isConnected } = useWeb3ModalAccount()


  const handleReownLogin = async () => {
    if (isConnected) {
      login(ConnectorNames.Injected)
    }
  }

  const handleClick = async () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      try {
        await connectReown()
        await handleReownLogin()
      } finally {
        // do nothing
      }
    }
  }


  return (
    <>
      <Button onClick={handleClick} variant="primary">
        {children || ('Connect Wallet')}
      </Button>
      
    </>
  )
}

export default ConnectWalletButton
