import { Button, Form, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { BigNumber } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { PaymentMod } from 'models/mods'
import { useLayoutEffect, useState } from 'react'
import { fromWad } from 'utils/formatNumber'

export default function PayModsForm({
  initialMods,
  currency,
  target,
  onSave,
}: {
  initialMods: PaymentMod[]
  currency: CurrencyOption
  target: BigNumber
  onSave: (mods: PaymentMod[]) => void
}) {
  // State objects avoid antd form input dependency rerendering issues
  const [mods, setMods] = useState<PaymentMod[]>([])

  useLayoutEffect(() => {
    setMods(initialMods)
  }, [])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <h1>Spending</h1>

        <p>
          Payouts let you commit portions of every withdrawal to other Ethereum
          wallets or Juicebox projects. Use this to pay contributors, charities,
          other projects you depend on, or anyone else. Payouts will be
          distributed automatically whenever a withdrawal is made from your
          project.
        </p>
        <p>
          Payouts are optional. By default, all unallocated revenue will be
          withdrawable to the project owner's wallet.
        </p>
      </div>

      <Form layout="vertical">
        <FormItems.ProjectPaymentMods
          name="mods"
          mods={mods}
          target={fromWad(target)}
          currency={currency}
          onModsChanged={setMods}
        />
        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={() => onSave(mods)}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
