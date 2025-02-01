import { getValidBlockedPips } from "@/engine";
import { Box } from "@chakra-ui/react";

export const ValidBlockers = ({
  blockers,
}: {
  blockers: { blocked?: string | undefined }[] | undefined;
}) => {
  const validBlockers = getValidBlockedPips(blockers).length;

  if (validBlockers === 0) return null;
  return <Box>Blockers: {validBlockers} pips blocked</Box>;
};
