import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export type UserData = {
  id?: string
  name: string
  isAdmin: boolean
}

export class User {
  readonly id: string
  readonly name: string
  readonly isAdmin: boolean

  constructor(userData: UserData, documentId: string) {
    this.id = documentId
    this.name = userData.name
    this.isAdmin = userData.isAdmin ?? false
  }
}

export const userConverter = {
  toFirestore: (user: User): UserData => {
    return {
      name: user.name,
      isAdmin: user.isAdmin,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<UserData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new User(data, snapshot.id)
  },
}

export const blankUserData: UserData = {
  name: '',
  isAdmin: false,
}

export const blankUser = new User(blankUserData, 'xxx')
