import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'

export type WeeklyAggregateData = {
  id?: string
  reportFormatId: string
  yearWeek: string
  reports: Record<string, string | number>
}

export class WeeklyAggregate {
  readonly id?: string
  readonly reportFormatId: string
  readonly yearWeek: string
  readonly reports: Record<string, string | number>

  constructor(weeklyAggregateData: WeeklyAggregateData) {
    this.id = weeklyAggregateData.id
    this.reportFormatId = weeklyAggregateData.reportFormatId
    this.yearWeek = weeklyAggregateData.yearWeek
    this.reports = weeklyAggregateData.reports
  }

  get timeLabel(): string {
    return `${this.month}月 第${this.monthlyWeek}週`
  }

  get month(): number {
    return Math.ceil(this.week / 4)
  }

  get week(): number {
    return Number(this.yearWeek.slice(-2))
  }

  get monthlyWeek(): number {
    return this.week % 4 > 0 ? this.week % 4 : 4
  }
}

export const weeklyAggregateConverter = {
  toFirestore: (weeklyAggregate: WeeklyAggregate): WeeklyAggregateData => {
    return {
      id: weeklyAggregate.id,
      reportFormatId: weeklyAggregate.reportFormatId,
      yearWeek: weeklyAggregate.yearWeek,
      reports: weeklyAggregate.reports,
    }
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<WeeklyAggregateData>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options)

    return new WeeklyAggregate({ ...data, id: snapshot.id })
  },
}

export const blankWeeklyAggregateData = {
  reportFormatId: '',
  yearWeek: '',
  reports: {},
}

export const blankWeeklyAggregate = new WeeklyAggregate(
  blankWeeklyAggregateData
)
