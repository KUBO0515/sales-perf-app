import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from 'firebase/firestore'

export type ReportInputs = Record<string, string>

export type ReportData = {
  id?: string
  userId: string
  reportFormatId: string
  inputs: ReportInputs
  createdAt: Timestamp
}

export class Report {
  readonly id?: string
  readonly userId: string
  readonly reportFormatId: string
  readonly inputs: ReportInputs
  readonly createdAt: Timestamp

  constructor(reportData: ReportData) {
    this.id = reportData.id
    this.userId = reportData.userId
    this.reportFormatId = reportData.reportFormatId
    this.inputs = reportData.inputs
    this.createdAt = reportData.createdAt
  }
}

export const reportConverter = {
  toFirestore: (report: Report): ReportData => {
    return {
      userId: report.userId,
      reportFormatId: report.reportFormatId,
      inputs: report.inputs,
      createdAt: report.createdAt,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<ReportData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new Report({ ...data, id: snapshot.id })
  },
}

export const blankReportData = {
  userId: '',
  reportFormatId: '',
  inputs: {},
  createdAt: Timestamp.now(),
}

export const blankReport = new Report(blankReportData)
