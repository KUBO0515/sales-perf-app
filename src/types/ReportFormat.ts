import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export type ReportFormatData = {
  id?: string
  name: string
}

export class ReportFormat {
  readonly id?: string
  readonly name: string

  constructor(reportFormatData: ReportFormatData) {
    this.id = reportFormatData.id
    this.name = reportFormatData.name
  }
}

export const reportFormatConverter = {
  toFirestore: (reportFormat: ReportFormat): ReportFormatData => {
    return {
      name: reportFormat.name,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<ReportFormatData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new ReportFormat({ ...data, id: snapshot.id })
  },
}

export const blankReportFormatData = {
  name: '',
}

export const blankReportFormat = new ReportFormat(blankReportFormatData)
