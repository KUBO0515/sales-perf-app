import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import { AppContext } from '@hooks/useApp'

export default function LoginPage() {
  const { appContext } = useContext(AppContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch {
      setError(
        'ログインに失敗しました。メールアドレスとパスワードを確認してください。'
      )
    }
  }

  if (appContext.isSignIn) {
    if (appContext.user.isAdmin) {
      navigate('/admin/home') // ログイン成功でユーザ用ページへ
    } else {
      navigate('/user/home') // ログイン成功で管理者用ページへ
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded bg-white p-8 shadow">
        <h2 className="mb-6 text-center text-2xl font-bold">ログイン</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  )
}
