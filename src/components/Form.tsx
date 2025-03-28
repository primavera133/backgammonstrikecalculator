import { Field } from "@/components/ui/field";
import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { LuMinus, LuPlus } from "react-icons/lu";
import { calcLikelyhood, formatLikelyhood } from "../engine";
import { Distance } from "./Distance";
import { ValidBlockers } from "./ValidBlockers";

interface FormValues {
  fromPos: string;
  toPos: string;
  blockers: {
    blocked: string | undefined;
  }[];
}

export const Form = () => {
  const [hits, setHits] = useState<[number, number][]>();
  const [error, setError] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      blockers: [],
    },
  });

  const { fromPos, toPos, blockers } = useWatch({
    control,
  });

  const { fields, append, remove } = useFieldArray({
    name: "blockers",
    control,
  });

  const onSubmit = handleSubmit(({ fromPos, toPos, blockers }: FormValues) => {
    const hits = calcLikelyhood(fromPos, toPos, blockers);
    setHits(hits);
    if (hits.length === 0) setError("not possible to hit!");
  });

  const reset = () => {
    setHits(undefined);
    setError("");
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <SimpleGrid gap={4} columns={3}  alignItems={"end"}>
          <GridItem>
            <Field
              label="Blot position"
              invalid={!!errors.toPos}
              errorText={errors.toPos?.message}
            >
              <Input
                {...register("toPos", {
                  required: "Blot position value is required",
                  min: 1,
                  max: 24,
                  onChange: reset,
                })}
                bgColor={"white"}
                color="black"
              />
            </Field>
          </GridItem>
          <GridItem>
            <Field
              label="Strike from (bar=0 or 25)"
              invalid={!!errors.fromPos}
              errorText={errors.fromPos?.message}
            >
              <Input
                {...register("fromPos", {
                  required: "From position value is required",
                  min: 0,
                  max: 25,
                  onChange: reset,
                })}
                bgColor={"white"}
                color="black"
              />
            </Field>
          </GridItem>

        </SimpleGrid>

        <Box>
          <Heading as="h3" size="md" mb={2}>
            Blocked pips <IconButton
                  aria-label="Add blocked pip"
                  size="xs"
                  variant="surface"
                  onClick={() =>
                    append({
                      blocked: undefined,
                    })
                  }
                >
                  <LuPlus />
                </IconButton>

          </Heading>
          {fields.map((field, index) => {
            return (
              <Flex key={field.id}>
                <Field
                  mb={2}
                  mr={2}
                  invalid={!!errors.blockers}
                >
                  <Input
                    {...register(`blockers.${index}.blocked` as const, {
                      min: 0,
                      max: 25,
                    })}
                    bgColor={"white"}
                    color="black"
                  />
                </Field>
                <IconButton
                  aria-label="Remove blocked pip"
                  size="xs"
                  variant="surface"
                  onClick={() => remove(index)}
                >
                  <LuMinus />
                </IconButton>
              </Flex>
            );
          })}
        </Box>


        {error && <Text color={"darkred"}>{error}</Text>}
        <Button variant="surface" type="submit">
          Submit
        </Button>
      </Stack>
      {hits && hits.length > 0 && (
        <Box my={4}>
          <Heading as="h3">Result</Heading>
          <Distance fromPos={fromPos} toPos={toPos} />
          <ValidBlockers blockers={blockers} />
          <Box>
            Chance to roll a hit: {hits.length}/36 or{" "}
            {formatLikelyhood(hits.length)}%
          </Box>
          <Box>
            Successfull rolls:{" "}
            <>{hits.map((hit) => `${hit[0]}+${hit[1]}`).join(", ")}</>
          </Box>
        </Box>
      )}
    </form>
  );
};
