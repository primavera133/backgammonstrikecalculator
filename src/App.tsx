import { Provider } from "@/components/ui/provider";
import { Box, Heading, Image } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import { Form } from "./components/Form";

function App() {
  return (
    <Provider>
      <Analytics />
      <Box mb={4}>
        <Heading as="h1">Backgammon strike statistics</Heading>
      </Box>
      <Box mb={4}>
        <Image src="board.png" />
      </Box>
      <Form />
    </Provider>
  );
}

export default App;
