import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
import { useWebModal } from '@webmodal/ethers5'
import { Web3Provider } from '@ethersproject/providers'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const { login } = useAuth()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const { chainId } = useActiveChainId()

  const { openWebModal, connected, account } = useWebModal({
    chainId,
    onConnect: async (provider) => {
  const ethersProvider = new Web3Provider(provider)
  await login(ethersProvider)
},
    language: code,
  })

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      // Bisa dipertahankan jika tetap ingin handle khusus NEZHA
    } else {
      openWebModal()
    }
  }

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {connected ? account?.short || account?.address : children || <Trans>Connect Wallet</Trans>}
      </Button>
    </>
  )
}

export default ConnectWalletButton
