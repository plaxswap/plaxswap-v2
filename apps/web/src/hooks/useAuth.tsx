import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { clearUserStates } from '../utils/clearUserStates'
import { useActiveChainId } from './useActiveChainId'
import { useSessionChainId } from './useSessionChainId'
import { Web3Provider } from '@ethersproject/providers'

const useAuth = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const [, setSessionChainId] = useSessionChainId()

  const login = useCallback(
    async (provider: Web3Provider) => {
      try {
        const network = await provider.getNetwork()
        if (network.chainId !== chainId) {
          // Optional: prompt user to switch chain manually in their wallet
          console.warn(`Expected chain ${chainId} but got ${network.chainId}`)
        }
        setSessionChainId(network.chainId)
        // You can save user info here or initialize states as needed
        return provider
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    [chainId, setSessionChainId],
  )

  const logout = useCallback(async () => {
    try {
      // If using ethers5 directly, you can't disconnect programmatically
      // Just clear state instead
    } catch (error) {
      console.error(error)
    } finally {
      clearUserStates(dispatch, { chainId })
    }
  }, [dispatch, chainId])

  return { login, logout }
}

export default useAuth
