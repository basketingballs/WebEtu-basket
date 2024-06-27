import { cookies } from "next/headers";
import axios from "axios";

const getGroup = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const dias = cookieStore.get("dias")?.value as string;
  const dia = JSON.parse(dias)[0];
  try {
    const res = await axios.get(
      `https://progres.mesrs.dz/api/infos/dia/${dia.id}/groups`,
      {
        headers: {
          Authorization: token,
        },
        timeout: 100000,
      }
    );

    const semesterInfo = {} as any;
    res.data
      .sort((a: any, b: any) => a.periodeId - b.periodeId)
      .forEach((item: any) => {
        if (!item.nomSection) return;
        const semesterKey = item.periodeLibelleLongLt;
        const group = item.nomGroupePedagogique;
        const section =
          item.nomSection === "Section" ? "Section 1" : item.nomSection;
        semesterInfo[semesterKey] = { group, section };
      });

    return semesterInfo;
  } catch (error) {
    console.error("Error fetching group and section info\n", error);
  }
};

export const metadata = {
  title: "WebEtu - Group",
};
export default async function Group() {
  const semesterInfo = (await getGroup()) as [
    { group: string; section: string }
  ];
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full max-w-3xl m-5 p-8 rounded-lg shadow-2xl">
      {Object.entries(semesterInfo).map(([semester, info], index) => (
        <div className={`flex flex-col gap-6 ${index > 0 ? 'mt-6' : ''}`} key={semester}>
          <h2 className="w-full rounded-lg p-3 text-center bg-green-500 text-white font-bold">
            {semester}
          </h2>
          <div className="flex flex-col bg-white rounded-lg p-4 shadow-md">
            <p className="mb-2">
              <span className="font-bold">Section:</span> {info.section}
            </p>
            <p className="mb-2">
              <span className="font-bold">Group:</span> {info.group}
            </p>
          </div>
        </div>
      ))}
    </div>
  );  
}