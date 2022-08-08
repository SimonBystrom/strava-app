import create from 'zustand'

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

export const emptyAthlete: Athlete = {
  id: 0,
  firstname: '',
  lastname: '',
  sex: Sex.Male,
  username: '',
  weight: 0,
}

type UserStoreProps = {
  athlete: Athlete,
  setAthlete: (athlete: Athlete) => void,
}

export const useUserStore = create<UserStoreProps>(
  (set => ({
    athlete: emptyAthlete,
    setAthlete: athlete => set({ athlete }),
  }))
)
