import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { useTransactor } from 'hooks/Transactor'

export const TransactionProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const transactor = useTransactor()

  return (
    <TransactionContext.Provider
      value={{
        transactor,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
