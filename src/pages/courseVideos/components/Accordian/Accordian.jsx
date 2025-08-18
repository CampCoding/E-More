import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
// import { Videos } from "../../libs/Videos";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export function AccordionCustomIcon({
  handleSelectVideo,
  Videos,
  selectedVideo,
  setTab,
  setIndex,
  index,
  tab,
  videoObj,
}) {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div className="accordion">
      {Videos.map((videoObj, tindex) => {
        return (
          <div onClick={() => setTab(tindex)}>
            <Accordion
              open={open === videoObj.id}
              icon={<Icon id={videoObj.id} open={open} key={videoObj.id} />}
            >
              <AccordionHeader
                onClick={() => handleOpen(videoObj.id)}
                className={
                  videoObj.id == open
                    ? "text-sm active"
                    : "text-sm text-[#597B82]"
                }
              >
                {videoObj.title}
              </AccordionHeader>
              <AccordionBody>
                {videoObj.videos.map((video, zindex) => (
                  <div
                    onClick={() => {
                      console.log(videoObj?.videos[index]?.id, video?.id);
                      setIndex(zindex);
                    }}
                    key={video.id}
                    className={
                      selectedVideo?.videoId == video?.id
                        ? "text-sm text-[#E94168] active flex gap-3 my-3 align-middle"
                        : "text-sm text-[#597B82] flex gap-3 my-3 align-middle"
                    }
                  >
                    <h4
                      className={
                        selectedVideo?.videoId == video?.id
                          ? "text-sm text-[#E94168] active font-normal text-[15px] cursor-pointer"
                          : "text-sm text-[#597B82] font-normal text-[15px] cursor-pointer"
                      }
                      onClick={() =>
                        handleSelectVideo(
                          videoObj.id,
                          video.id,
                          videoObj.title,
                          video.name
                        )
                      }
                    >
                      {zindex + 1} . {video.name}
                    </h4>
                  </div>
                ))}
              </AccordionBody>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
