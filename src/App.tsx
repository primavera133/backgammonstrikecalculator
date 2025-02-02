import { Provider } from "@/components/ui/provider";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import { Form } from "./components/Form";

function App() {
  return (
    <Provider>
      <Analytics />
      <Box mb={4}>
        <Heading as="h1">Backgammon strike statistics</Heading>
        <Text>
          Calculate the risk of a blot by checking the chance to get hit from
          another position. A blot is a single checker on a point, which is
          vulnerable to being hit by an opponent's checker. The risk can be
          calculated based on the number of possible rolls that can hit the
          blot.
        </Text>
        <Text>
          Add blocked pips inbetween the starting pip and the blot if you want
          to add that to the calculations.
        </Text>
      </Box>
      <Box mb={4}>
        <Image src="board.png" />
      </Box>
      <Form />
    </Provider>
  );
}

export default App;
