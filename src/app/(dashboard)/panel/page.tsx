import Enrollments from "@/components/Enrollments"
import { getDias } from "@/utils/api/panel"
import Link from "next/link"

export const metadata = {
  title: "WebEtu - Panel",
}

export default async function PanelPage() {
  const dias = await getDias()
  const currentYear = process.env.CURRENT_YEAR

  return (
    <div className="flex flex-1 flex-col gap-4 max-w-5xl md:mx-12 lg:mx-24 p-5">
      <h1 className="md:text-xl lg:text-3xl font-bold">Enrollments:</h1>
      <Enrollments dias={dias} currentYear={currentYear} />
    </div>
  )
}
