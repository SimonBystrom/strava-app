import { StravaData } from "@prisma/client";
import { useEffect, useState } from "react";


export const useLocalStorageTokens = () => {
  const [tokens, setTokens] = useState<StravaData | null>(null)


  useEffect(() => {
    const asyncLocalStorage = {
      setItem: async function (key: string, value: string) {
        await null;
        return localStorage.setItem(key, value);
      },
      getItem: async function (key: string) {
        await null;
        return localStorage.getItem(key);
      }
    }
    const checkLocalStorage = async () => {
      const localStorageObj = await asyncLocalStorage.getItem('strava')
      if (localStorageObj) {
        console.log('local Storage with tokens found in UserMain')
        setTokens(JSON.parse(localStorageObj))
      }
    }

    checkLocalStorage()
  }, [])

  return tokens
}
