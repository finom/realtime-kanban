"use client";
import useWebRTCAudioSession from "@/hooks/useWebRTCAudioSession";
import tools from "@/lib/tools";
import Floaty from "./Floaty";

const RealTimeDemo = () => {
  const {
    isActive,
    isTalking,
    handleStartStopClick,
  } = useWebRTCAudioSession("ash", tools);

  return (
    <Floaty
      isActive={isActive}
      isTalking={isTalking}
      handleClick={handleStartStopClick}
    />
  );
};

export default RealTimeDemo;
