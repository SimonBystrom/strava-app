enum Sex {
  Male = 'M',
  Female = 'F'
}

export type Athlete = {
  id: number,
  firstname: string,
  lastname: string,
  sex: Sex.Male | Sex.Female
  username: string,
  weight: number,
}

export type ActivityTime = {
  hours: number,
  minutes: number,
  seconds: number,
}

export type Activity = {
  type: 'Run' | 'Ride',
  name: string,
  averageSpeed: number,
  distance: number,
  maxSpeed: number,
  startDateLocal: string,
  elapsedTime: ActivityTime,
  movingTime: ActivityTime,
  unparsedTime: number,
}

export enum TimePeriod {
  Month = 'month',
  Year = 'year',
  All = 'all',
  Custom = 'custom'
}

export type RunningData = {
  total: number,
  time: ActivityTime,
  distance: number,
  oneKM: number,
  twoKM: number,
  threeKM: number,
  fiveKM: number,
  tenKM: number,
  // halfMarathon: number,
  // marathon: number,
}

export type BaseStats = {
  count: number,
  distance: number,
  elapsedTime: ActivityTime,
  elevationGain: number,
  movingTime: ActivityTime,
}
