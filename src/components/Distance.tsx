import { getDistance } from "@/engine";
import { Box } from "@chakra-ui/react";

export const Distance = ({
  fromPos,
  toPos,
}: {
  fromPos: string | undefined;
  toPos: string | undefined;
}) => {
  return <Box>Distance: {getDistance(fromPos, toPos)} pips</Box>;
};
