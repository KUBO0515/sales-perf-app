import { useState } from 'react'

type ToggleProps = {
  /** 最初の状態（デフォルト false） */
  defaultChecked?: boolean
  /** 状態が変わったとき呼ばれるコールバック */
  onChange?: (checked: boolean) => void
  /** ラベル（任意） */
  label?: string
  opponentLabel?: string
}

export default function Toggle({
  defaultChecked = false,
  onChange,
  label,
  opponentLabel,
}: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked)

  const handleToggle = () => {
    const next = !checked
    setChecked(next)
    onChange?.(next) // 親コンポーネントに通知
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label ?? 'toggle'}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        {/* ツマミ */}
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-1'}`}
        />
      </button>
      <span className="ml-2 text-sm text-gray-700">{opponentLabel}</span>
    </div>
  )
}
