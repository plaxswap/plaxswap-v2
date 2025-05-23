import { ModalProvider, light, dark, UIKitProvider } from '@pancakeswap/uikit'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { LanguageProvider } from '@pancakeswap/localization'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { Store } from '@reduxjs/toolkit'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { WagmiProvider } from '@pancakeswap/wagmi'
import { client } from 'utils/wagmi'
import { HistoryManagerProvider } from 'contexts/HistoryContext'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import { polygon } from 'wagmi/chains'
import { ChainId } from '@pancakeswap/sdk'

const projectId = '9ba1c138ff7ad815f7026b920b652f0b';

const metadata = {
  name: 'plaxswap',
  description: 'PlaxSwap DEX',
  url: 'https://plaxswap.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: ChainId.BSC,
  
});

createWeb3Modal({
  ethersConfig,
  chains: [polygon],
  projectId,
  enableAnalytics: true,
  allowUnsupportedChain: true,
  enableOnramp: true,
});

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {children}
    </UIKitProvider>
  )
}

const Providers: React.FC<React.PropsWithChildren<{ store: Store; children: React.ReactNode }>> = ({
  children,
  store,
}) => {
  return (
    <WagmiProvider client={client}>
      <Provider store={store}>
        <NextThemeProvider>
          <StyledUIKitProvider>
            <LanguageProvider>
              <SWRConfig
                value={{
                  use: [fetchStatusMiddleware],
                }}
              >
                <HistoryManagerProvider>
                  <ModalProvider>{children}</ModalProvider>
                </HistoryManagerProvider>
              </SWRConfig>
            </LanguageProvider>
          </StyledUIKitProvider>
        </NextThemeProvider>
      </Provider>
    </WagmiProvider>
  )
}

export default Providers
