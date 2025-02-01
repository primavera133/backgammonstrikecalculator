import { Field } from "@/components/ui/field";
import {
  Box,
  Button,
  GridItem,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { calcLikelyhood, formatLikelyhood, getDistance } from "./engine";

interface FormValues {
  fromPos: number;
  toPos: number;
  blocked: number;
}

export const Form = () => {
  const [hits, setHits] = useState<number>(0);
  const [error, setError] = useState("");
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(({ fromPos, toPos, blocked }: FormValues) => {
    console.log("fromPos", fromPos);
    if (fromPos > 24 || fromPos < 1) return setError("Invalid from position");
    if (toPos > 24 || toPos < 1) return setError("Invalid to position");

    const distance = Math.abs(fromPos - toPos);

    if (distance <= blocked) {
      return setError("Not possible, too many blocked");
    }
    const hits = calcLikelyhood(distance, blocked);
    setHits(hits);
    if (hits === 0) setError("not possible to hit!");
  });

  const reset = () => {
    setHits(0);
    setError("");
  };

  const fromPos = getValues("fromPos");
  const toPos = getValues("toPos");
  const blocked = getValues("blocked");

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <SimpleGrid gap={4} columns={3}>
          <GridItem>
            <Field
              label="From postion"
              invalid={!!errors.fromPos}
              errorText={errors.fromPos?.message}
            >
              <Input
                {...register("fromPos", {
                  required: "From position value is required",
                  min: 1,
                  max: 24,
                  onChange: reset,
                })}
              />
            </Field>
          </GridItem>
          <GridItem>
            <Field
              label="To position"
              invalid={!!errors.toPos}
              errorText={errors.toPos?.message}
            >
              <Input
                {...register("toPos", {
                  required: "To position value is required",
                  min: 1,
                  max: 24,
                  onChange: reset,
                })}
              />
            </Field>
          </GridItem>
          <GridItem>
            <Field
              label="Blocked positions"
              invalid={!!errors.blocked}
              errorText={errors.blocked?.message}
            >
              <Input
                {...register("blocked", {
                  onChange: reset,
                  max: 22,
                })}
              />
            </Field>
          </GridItem>
        </SimpleGrid>

        {error && <Text color={"darkred"}>{error}</Text>}
        <Button variant="surface" type="submit">
          Submit
        </Button>
      </Stack>
      {hits > 0 && (
        <Box my={6}>
          <Text textStyle={"3xl"}>
            For a distance of {getDistance(fromPos, toPos)} pips{" "}
            {blocked && <span>, and with {blocked} pips blocked, </span>}
            the chances to roll a hit are {hits}/36 or {formatLikelyhood(hits)}%
          </Text>
        </Box>
      )}
    </form>
  );
};
