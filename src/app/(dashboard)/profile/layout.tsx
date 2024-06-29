export const metadata = {
  title: "WebEtu - Profile",
};

const Layout = async ({
  children,
  image,
  logo,
}: {
  children: React.ReactNode;
  image: React.ReactNode;
  logo: React.ReactNode;
}) => {
  return (
    <div className="bg-gray-300 border-2 border-green-700 w-full h-max max-w-3xl m-5 p-8 flex flex-col gap-8 rounded-lg shadow-2xl box-border">
      <div className="text-center flex justify-between items-center">
        <div className="transition duration-300 ease-in-out transform hover:scale-105">
          {image}
        </div>
        <div className="transition duration-300 ease-in-out transform hover:scale-105">
          {logo}
        </div>
      </div>
      <div className="text-left min-h-20 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default Layout;
