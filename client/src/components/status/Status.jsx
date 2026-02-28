import React from "react";
import StausUserCard from "./StatusUserCard";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const Status = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <div>
      <div className="flex items-center px-[14vw] py-[7vh]">
        {/* left side part */}
        <div className="left h-[85vh] bg-[#1e262c] lg:w-[30%] w-[50%] px-5">
          <div className="pt-5 h-[13%]">
            <StausUserCard />
          </div>
          <hr />
          <div className="overflow-y-scroll h-[86%] p-2">
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
              21, 22, 33, 44, 55, 66, 77,
            ].map((item) => (
              <StausUserCard key={item} />
            ))}
          </div>
        </div>
        {/* right side part */}
        <div className="relative h-[85vh] lg:w-[70%] w-[50%] bg-[#0b141a]">
          <AiOutlineClose
            onClick={handleNavigate}
            className="text-white cursor-pointer absolute top-5 right-10 text-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Status;
