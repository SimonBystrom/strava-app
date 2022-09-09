import { Exercise, User, Workout } from "@prisma/client"
import { z } from "zod"
import { exerciseSchema, loggedActivitySchema, userActivitySchema, workoutSchema } from "../validations/userActivity"
import { createRouter } from "./context"

export const userActivityRouter = createRouter()
  .query('getUserExercises', {
    input: z.object({
      userId: z.string()
    }),
    resolve: async ({input: {userId}, ctx}) => {
      return await ctx.prisma.exercise.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          createdAt: 'desc'
        },
      })
    }
  })
  .query('getAllExercises', {
    input: z.object({
      userId: z.string()
    }),
    resolve: async ({input: {userId}, ctx}) => {
      return await ctx.prisma.exercise.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })
    }
  })
  .query('getUserWorkouts', {
    input: z.object({
      userId: z.string()
    }),
    resolve: async ({input: {userId}, ctx}) => {
      // return await ctx.prisma.workout.findMany({
      //   where: {
      //     userId: userId
      //   },
      //   orderBy: {
      //     createdAt: 'desc'
      //   },
      // })
      const userActivities = await ctx.prisma.userActivity.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          exercise: true,
          workout: true,
          user: true,
        }
      })
      let results: {
        id: string,
        name: string,
        sets: number,
        user: User,
        userId: string,
        exercises: Exercise[]
      }[] = []
      userActivities.forEach(activity => {
        const existingWorkout = results.find(elem => elem.id === activity.workoutId)
        if (existingWorkout) {
          existingWorkout.exercises.push(activity.exercise)
        } else {
          results.push({
            id: activity.workoutId,
            name: activity.workout.name,
            sets: activity.workout.sets,
            user: activity.user,
            userId: activity.userId,
            exercises: [activity.exercise],
          })
        }
      })
      return results
    }
  })
  .mutation('createExercise', {
    input: exerciseSchema,
    resolve: async ({input, ctx}) => {
      const {name, reps, description, userId} = input
      return await ctx.prisma.exercise.create({
        data: {
          name,
          reps,
          description,
          user: {
            connect: {
              id: userId
            }
          },
        },
        include: {
          user: true
        }
      })
    }
  })
  .mutation('createWorkout', {
    input: userActivitySchema,
    resolve: async ({input, ctx}) => {
      const {name, sets, userId, exercises} = input
      const workout = await ctx.prisma.workout.create({
        data: {
          name,
          sets,
          user: {
            connect: {
              id: userId
            }
          }
        }
      })

      for(let exerciseData of exercises) {
        await ctx.prisma.userActivity.create({
          data: {
            user: {
              connect: {
                id: userId
              }
            },
            workout: {
              connect: {
                id: workout.id
              }
            },
            exercise: {
              connect: {
                id: exerciseData
              }
            }
          }
        })
      }
      const results = await ctx.prisma.userActivity.findMany({
        where: {
          workoutId: workout.id
        },
        include: {
          exercise: true,
          workout: true,
        }
      })
      const allExercises = results.map(data => data.exercise)
      return {
        workout: results[0]?.workout,
        exercises: allExercises
      }
     /**
      * desired results: {
      *   workout: -> workout,
      *   exercises: [exercise{}, exercise{}]
      * }
      * */
    }
  })
  .mutation('createLoggedActivity', {
    input: loggedActivitySchema,
    resolve: async ({input, ctx}) => {
      const { userId, workoutId, date } = input

      const loggedActivity = await ctx.prisma.loggedActivity.create({
        data: {
          date,
          user: {
            connect: {
              id: userId,
            }
          },
          workout: {
            connect: {
              id: workoutId,
            }
          }
        }
      })
      return loggedActivity
    }
  })
  .query('getUserLoggedActivities', {
    input: z.object({
      userId: z.string()
    }),
    resolve: async ({input: {userId}, ctx}) => {
      const loggedActivities = await ctx.prisma.loggedActivity.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          workout: true
        }
      })
      return loggedActivities
    }
  })
