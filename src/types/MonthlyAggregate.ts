import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export type MonthlyAggregateData = {
  id?: string
  reportFormatId: string
  ym: string
  reports: Record<string, string | number>
}

export class MonthlyAggregate {
  readonly id?: string
  readonly reportFormatId: string
  readonly ym: string
  readonly reports: Record<string, string | number>

  constructor(monthlyAggregateData: MonthlyAggregateData) {
    this.id = monthlyAggregateData.id
    this.reportFormatId = monthlyAggregateData.reportFormatId
    this.ym = monthlyAggregateData.ym
    this.reports = monthlyAggregateData.reports
  }

  get timeLabel(): string {
    return `${this.ym.slice(0, 4)}年${Number(this.ym.slice(4, 6))}月`
  }
}

export const monthlyAggregateConverter = {
  toFirestore: (monthlyAggregate: MonthlyAggregate): MonthlyAggregateData => {
    return {
      id: monthlyAggregate.id,
      reportFormatId: monthlyAggregate.reportFormatId,
      ym: monthlyAggregate.ym,
      reports: monthlyAggregate.reports,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<MonthlyAggregateData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new MonthlyAggregate({ ...data, id: snapshot.id })
  },
}

export const blankMonthlyAggregateData = {
  reportFormatId: '',
  ym: '',
  reports: {},
}

export const blankMonthlyAggregate = new MonthlyAggregate(
  blankMonthlyAggregateData
)
