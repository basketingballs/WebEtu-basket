"use client"

function ExamNotes({ item }: { item: any }) {
  const headerStyle =
    "text-l md:text-2xl font-extrabold text-center text-gray-600 mb-4 "

  return (
    <>
      <div>
        <h3 className={`${headerStyle}`}>Normal Session</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 capitalize text-xs md:text-sm lg:text-lg">
          {item.normal.map((course: any) => (
            <div
              className={`rounded p-4 lg:p-6 transition transform flex border border-gray-300 hover:scale-105 ${
                course.noteExamen == null
                  ? "bg-gray-300/90 text-gray-800"
                  : course.noteExamen >= 10
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
              }`}
              key={course.id}
            >
              <h4 className="font-semibold flex-1">{course.mcLibelleFr}</h4>
              <p className="font-bold ml-1">
                {course.noteExamen != null ? course.noteExamen : "Null"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {item.rattrappage.length > 0 && (
        <div>
          <h3 className={`${headerStyle} mt-4`}>Rattrapage Session</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 capitalize text-xs md:text-sm lg:text-lg">
            {item.rattrappage.map((course: any) => (
              <div
                className={`rounded p-4 lg:p-6 transition transform flex border border-gray-300 hover:scale-105 ${
                  course.noteExamen == null
                    ? "bg-gray-300/90 text-gray-800"
                    : course.noteExamen >= 10
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                }`}
                key={course.id}
              >
                <h4 className="font-semibold flex-1">{course.mcLibelleFr}</h4>
                <p className="font-bold ml-1">
                  {course.noteExamen == null ? "Empty" : course.noteExamen}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ExamNotes
