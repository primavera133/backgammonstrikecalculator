import { Field } from "@/components/ui/field";
import {
  Box,
  Button,
  GridItem,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { calcLikelyhood, formatLikelyhood, getDistance } from "./engine";

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
      blockers: [{ blocked: undefined }],
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
    console.clear();
    console.log("onSubmit", fromPos, toPos, blockers);

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
        </SimpleGrid>

        <Box>
          <Heading as="h3" size="md">
            Blocked pips
          </Heading>
          {fields.map((field, index) => {
            return (
              <Field
                key={field.id}
                mb={2}
                // label="Blocked position"
                invalid={!!errors.blockers}
                //   errorText={errors.blockers?.message}
              >
                <Input
                  {...register(`blockers.${index}.blocked` as const, {
                    //   onChange: reset,
                    min: 1,
                    max: 24,
                  })}
                />
              </Field>
            );
          })}
        </Box>

        <Button
          size="xs"
          variant="surface"
          onClick={() =>
            append({
              blocked: undefined,
            })
          }
        >
          Add blocked pip
        </Button>
        <Button size="xs" variant="surface" onClick={() => remove(0)}>
          Remove blocked pip
        </Button>

        {error && <Text color={"darkred"}>{error}</Text>}
        <Button variant="surface" type="submit">
          Submit
        </Button>
      </Stack>
      {hits && hits.length > 0 && (
        <Box my={4}>
          <Heading as="h3">Result</Heading>
          <Box>Distance: {getDistance(fromPos, toPos)} pips</Box>
          <Box>{blockers && <>Blockers: {blockers.length} pips blocked</>}</Box>
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
