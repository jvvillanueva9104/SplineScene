import Image from "next/image";

const ScreenSaver = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-[450px] p-10 h-full bg-gradient-to-b from-blue-900 to-black opacity-[0.75] z-50">
        <div className="flex flex-col items-center justify-center h-[300px] w-full border-b-2 border-solid mt-[-50px]">
          <div className=" border-[5px] border-yellow-400 rounded-full relative z-10">
            <div className="absolute top-[-15px] left-[37px] flex justify-center items-center w-[25px] h-[25px] rounded-full bg-yellow-400 border-yellow-400 border-[5px] text-[12px] font-bold">
              1
            </div>
            <Image
              className="rounded-full h-[100px] w-[100px]"
              src="/test.jpg"
              alt="test"
              width={100}
              height={100}
            />
          </div>
          <h1 className=" mt-2 text-[35px] uppercase">Auckland</h1>
          <div className="flex justify-center items-center mb-[-50px]">
            <Image
              src="/Water_Symbol.png"
              alt="waterSymbol"
              height={40}
              width={40}
              className="ml-[-10px]"
            ></Image>
            <span className="text-[25px] mr-2">95%</span>
            <Image
              src="/Fire_Symbol.png"
              alt="sunSymbol"
              height={40}
              width={40}
            ></Image>
            <span className="text-[25px]">3</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenSaver;
