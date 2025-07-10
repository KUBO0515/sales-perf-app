import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export type ReportFormatTypes = 'string' | 'number' | 'select'

export function isReportFormatType(value: unknown): value is ReportFormatTypes {
  return value === 'string' || value === 'number' || value === 'select'
}

export type ReportFormatInputData = {
  id?: string
  name: string
  type: ReportFormatTypes
  options: string[]
  default: string
  disabled: boolean
}

export class ReportFormatInput {
  readonly id?: string
  readonly name: string
  readonly type: ReportFormatTypes
  readonly options: string[]
  readonly default: string
  readonly disabled: boolean

  constructor(reportFormatInputData: ReportFormatInputData) {
    this.id = reportFormatInputData.id
    this.name = reportFormatInputData.name
    this.type = reportFormatInputData.type
    this.options = reportFormatInputData.options || []
    this.default = reportFormatInputData.default || ''
    this.disabled = reportFormatInputData.disabled || false
  }
}

export const reportFormatInputConverter = {
  toFirestore: (
    reportFormatInput: ReportFormatInput
  ): ReportFormatInputData => {
    return {
      name: reportFormatInput.name,
      type: reportFormatInput.type,
      options: reportFormatInput.options,
      default: reportFormatInput.default,
      disabled: reportFormatInput.disabled,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<ReportFormatInputData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new ReportFormatInput({ ...data, id: snapshot.id })
  },
}

export const blankReportFormatInputData = {
  name: '',
  type: 'string' as const,
  options: [],
  default: '',
  disabled: false,
}

export const blankReportFormatInput = new ReportFormatInput(
  blankReportFormatInputData
)
