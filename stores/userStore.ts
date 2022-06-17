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
  accessToken: string,
  refreshToken: string,
  athlete: Athlete,
  setAccessToken: (accessToken: string) => void,
  setRefreshToken: (refreshToken: string) => void,
  setAthlete: (athlete: Athlete) => void,
}

export const useUserStore = create<UserStoreProps>(
  (set => ({
    accessToken: '',
    refreshToken: '',
    athlete: emptyAthlete,
    setAccessToken: accessToken => set({ accessToken}),
    setRefreshToken: refreshToken => set({ refreshToken}),
    setAthlete: athlete => set({ athlete }),
  }))
)
