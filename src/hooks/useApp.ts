import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db } from '@/firebase'
import { userReferenceConverter } from '@/types/UserReference'
import { blankUser, User, userConverter } from '@/types/User'
import { blankCompany, Company, companyConverter } from '@/types/Company'

export type AppContextValue = {
  isSignIn: boolean // サインイン状態かどうか
  company: Company
  user: User
}

export type AppContextType = {
  appContext: AppContextValue
  setAppContext: Dispatch<SetStateAction<AppContextValue>>
}

export const initialAppContext: AppContextValue = {
  isSignIn: false,
  company: blankCompany,
  user: blankUser,
}

export const AppContext = createContext<AppContextType>({
  appContext: initialAppContext,
  setAppContext: () => {},
})

/**
 * <App />コンポーネント専用で使用するカスタムフック。Context変数をStateとして作成したりしている。
 */
const useApp = () => {
  const [appContext, setAppContext] =
    useState<AppContextValue>(initialAppContext)

  useEffect(() => {
    // サインイン状態の変更時に実行する処理を購読する
    const authStateChanged = auth.onAuthStateChanged(async (user) => {
      const mySocialUid = user?.uid ?? auth.currentUser?.uid

      // 更新contextの初期値
      const { company } = appContext

      if (!mySocialUid) {
        // 非サインイン状態などuidが存在しないとき(ログアウト時など)は、初期値を設定する
        setAppContext(initialAppContext)

        return
      }

      // まず、userドキュメントのパスがあるドキュメントから取得する
      let userReferenceSnap = await getDoc(
        doc(db, 'userReferences', mySocialUid).withConverter(
          userReferenceConverter
        )
      )

      // ユーザ参照が存在しない場合は3秒待ってリトライする
      if (!userReferenceSnap.exists()) {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        userReferenceSnap = await getDoc(
          doc(db, 'userReferences', mySocialUid).withConverter(
            userReferenceConverter
          )
        )
      }

      // userReferenceが存在したときだけユーザ情報を取得する。
      const newUserSnap = userReferenceSnap.exists()
        ? await getDoc(
            userReferenceSnap.data().path.withConverter(userConverter)
          )
        : null

      if (newUserSnap === null || !newUserSnap.exists()) {
        setAppContext(initialAppContext)
        return
      }

      // 会社情報を取得する
      const newCompanySnap = await getDoc(
        doc(
          db,
          'companies',
          newUserSnap.ref.parent.parent?.id ?? 'xxx'
        ).withConverter(companyConverter)
      )

      const newCompany = newCompanySnap.exists()
        ? newCompanySnap.data()
        : company

      setAppContext((appContext) => ({
        ...appContext,
        isSignIn: true,
        user: newUserSnap.data(),
        company: newCompany,
      }))
    })

    return () => authStateChanged()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { appContext, setAppContext }
}

export default useApp
