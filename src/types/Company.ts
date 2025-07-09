import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export type CompanyData = {
  id?: string
  name: string
}

export class Company {
  readonly id?: string
  readonly name: string

  constructor(companyData: CompanyData) {
    this.id = companyData.id
    this.name = companyData.name
  }
}

export const companyConverter = {
  toFirestore: (company: Company): CompanyData => {
    return {
      name: company.name,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<CompanyData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new Company({ ...data, id: snapshot.id })
  },
}

export const blankCompanyData = {
  name: '',
}

export const blankCompany = new Company(blankCompanyData)
