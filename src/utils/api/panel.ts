import logger from "@/utils/logger"
import { longCache, shortCache } from "@/utils/cache"
import { fetchData, getCookieData } from "./helpers"
import PeriodTab from "@/app/panel/[year]/page"

export const getDias = async () => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `dias-${tokenHash}`
  const cachedData = longCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getDias")
    return cachedData
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dias`,
      token,
    )
    logger.info("Success", user, "getDias")
    longCache.set(cacheKey, response.data)

    return response.data
  } catch (error: any) {
    logger.error("Error", user, "getDias")
    throw new Error(error)
  }
}

export const getNormalNotes = async (id: number) => {
  const { token, user, tokenHash } = getCookieData()

  const cacheKey = `notes-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getNormalNotes")
    return cachedData
  }

  const parseData = (data: any) => {
    const firstSemNotes = [] as any[]
    const secondSemNotes = [] as any[]

    let firstSemKey = data[0].llPeriode
    let secondSemKey =
      data.find((item: any) => item.llPeriode !== firstSemKey)?.llPeriode ||
      firstSemKey

    if (firstSemKey > secondSemKey) firstSemKey = secondSemKey

    data.forEach((item: any) => {
      if (item.llPeriode === firstSemKey) firstSemNotes.push(item)
      else secondSemNotes.push(item)
    })

    return { firstSemNotes, secondSemNotes }
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/controleContinue/dia/${id}/notesCC`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getNormalNotes")

    return data
  } catch (error: any) {
    logger.error("Error", user, "getNormalNotes")
    return { firstSemNotes: null, secondSemNotes: null }
  }
}

export const getExamsNotes = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `exams-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getExamsNotes")
    return cachedData
  }

  const parseData = (data: any) => {
    const firstSemExams = {
      normal: [],
      rattrappage: [],
    } as any
    const secondSemExams = {
      normal: [],
      rattrappage: [],
    } as any

    const periods = data.map((course: any) => course.idPeriode)
    const firstSemId = Math.min(...periods)

    data.forEach((course: any) => {
      const period = course.idPeriode
      const session = course.planningSessionIntitule

      if (session === "session_1") {
        period == firstSemId
          ? firstSemExams.normal.push(course)
          : secondSemExams.normal.push(course)
      } else {
        period == firstSemId
          ? firstSemExams.rattrappage.push(course)
          : secondSemExams.rattrappage.push(course)
      }
    })

    return { firstSemExams, secondSemExams }
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/planningSession/dia/${id}/noteExamens`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getExamsNotes")

    return data
  } catch (error: any) {
    logger.error("Error", user, "getExamsNotes")
    return { firstSemExams: null, secondSemExams: null }
  }
}

export const getSemesterResults = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `semesters-transcripts-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache ", user, "getSemesterResults")
    return cachedData
  }

  let firstSemResults: any[] = []
  let secondSemResults: any[] = []

  const parseData = (data: any) => {
    if (data[1] === undefined) {
      firstSemResults = data[0]
      return { firstSemResults, secondSemResults }
    }

    let firstSemBool =
      data[0].periodeLibelleFr < data[1].periodeLibelleFr ? true : false

    if (firstSemBool) {
      firstSemResults = data[0]
      secondSemResults = data[1]
    } else {
      firstSemResults = data[1]
      secondSemResults = data[0]
    }

    return { firstSemResults, secondSemResults }
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dias/${id}/periode/bilans`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getSemesterResults")

    return data
  } catch (error) {
    logger.error("Error", user, "getSemesterResults")
    return { firstSemResults, secondSemResults }
  }
}

export const getYearTranscript = async (id: number) => {
  const { token, user, uuid, tokenHash } = getCookieData()

  const cacheKey = `year-transcript-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getYearTranscript")
    return cachedData
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/dia/${id}/annuel/bilan`,
      token,
    )

    const data = response.data
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getYearTranscript")

    return data
  } catch (error) {
    logger.error("Error", user, "getYearTranscript")
    return null
  }
}

export const getGroup = async (id: number) => {
  const { token, user, tokenHash } = getCookieData()

  const cacheKey = `group-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getGroup")
    return cachedData
  }

  function parseData(data: any) {
    const sortedData = data.sort((a: any, b: any) => a.periodeId - b.periodeId)

    return sortedData.reduce((semesterInfo: any, item: any) => {
      if (!item.nomSection) return semesterInfo

      const semester = item.periodeLibelleLongLt
      const group = item.nomGroupePedagogique
      const section =
        item.nomSection === "Section" ? "Section 1" : item.nomSection

      semesterInfo[semester] = {
        group,
        section,
        PeriodId: item?.periodeId,
      }

      return semesterInfo
    }, {})
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/dia/${id}/groups`,
      token,
    )

    const data = parseData(response.data)
    shortCache.set(cacheKey, data)

    logger.info("Success", user, "getGroup")

    return data
  } catch (error) {
    logger.error("Error", user, "getGroup")
    return null
  }
}

export const getTimeTable = async (id: number) => {
  const { token, user, tokenHash, uuid } = getCookieData()

  const cacheKey = `timetable-${id}-${tokenHash}`
  const cachedData = shortCache.get(cacheKey)

  if (cachedData) {
    logger.info("Cache", user, "getTimeTable")
    return cachedData
  }

  const parseData = (data: any, currentYearId: number) => {
    let parsedData = data.reduce((acc: any, item: any) => {
      const existingPeriod = acc.find(
        (period: any) => period.periodId === item.periodeId,
      )

      if (existingPeriod) {
        existingPeriod.schedule.push(item)
      } else {
        acc.push({
          periodId: item.periodeId,
          schedule: [item],
        })
      }

      return acc
    }, [])

    let firstSemTimeTable = parsedData[0] || null
    let secondSemTimeTable = parsedData[1] || null

    if (secondSemTimeTable === null && currentYearId !== id) {
      secondSemTimeTable = firstSemTimeTable
      firstSemTimeTable = null
    }

    return { firstSemTimeTable, secondSemTimeTable }
  }

  try {
    const response = await fetchData(
      `${process.env.PROGRES_API}/seanceEmploi/inscription/${id}`,
      token,
    )

    const diaResponse = await fetchData(
      `${process.env.PROGRES_API}/bac/${uuid}/anneeAcademique/${process.env.CURRENT_YEAR}/dia`,
      token,
    )

    if (response.data === "") {
      shortCache.set(cacheKey, {
        firstSemTimeTable: null,
        secondSemTimeTable: null,
      })
      return { firstSemTimeTable: null, secondSemTimeTable: null }
    }
    const data = parseData(response.data, diaResponse.data.id)

    shortCache.set(cacheKey, data)
    logger.info("Success", user, "getTimeTable")
    return data
  } catch (error) {
    logger.error("Error", user, "getTimeTable")
    return null
  }
}
