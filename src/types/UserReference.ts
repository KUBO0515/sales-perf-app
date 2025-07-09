import {
  DocumentReference,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'

export type UserReferenceData = {
  id?: string
  path: DocumentReference
}

export class UserReference {
  readonly id?: string
  readonly path: DocumentReference

  constructor(userReferenceData: UserReferenceData) {
    this.id = userReferenceData.id
    this.path = userReferenceData.path
  }
}

export const userReferenceConverter = {
  toFirestore: (userReference: UserReference): UserReferenceData => {
    return {
      path: userReference.path,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<UserReferenceData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new UserReference({ ...data, id: snapshot.id })
  },
}
