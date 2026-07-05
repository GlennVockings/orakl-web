"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { Team } from "@/lib/types";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    name: z.string().min(5, {
      message: "Name must be at least 5 characters",
    }),
    selectionType: z.enum(["teams", "labels"]),
    teamSelections: z.array(
      z.object({
        teamId: z.string(),
        selected: z.boolean(),
        decimalOdds: z.coerce.number().gt(1, "Odds must be greater than 1"),
      }),
    ),
    labelSelections: z.array(
      z.object({
        label: z.string().trim(),
        decimalOdds: z.coerce.number().gt(1, "Odds must be greater than 1"),
      }),
    ),
  })
  .superRefine((values, ctx) => {
    if (values.selectionType === "teams") {
      const selectedTeams = values.teamSelections.filter((team) => team.selected);

      if (selectedTeams.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["teamSelections"],
          message: "Select at least one team",
        });
      }
    }

    if (values.selectionType === "labels") {
      const validLabels = values.labelSelections.filter(
        (label) => label.label.trim().length > 0,
      );

      if (validLabels.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["labelSelections"],
          message: "Add at least one label",
        });
      }

      const normalized = validLabels.map((label) =>
        label.label.trim().toLowerCase(),
      );

      if (new Set(normalized).size !== normalized.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["labelSelections"],
          message: "Labels must be unique",
        });
      }
    }
  });

type AddMarketFormValues = z.infer<typeof formSchema>;

export const AddMarket = ({
  teams,
  gameId,
  isAdmin
}: {
  teams: Team[];
  gameId: string;
  isAdmin: boolean;
}) => {
  const [isForm, setIsForm] = useState(false);

  const form = useForm<AddMarketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      selectionType: teams.length > 0 ? "teams" : "labels",
      teamSelections: teams.map((team) => ({
        teamId: team.id,
        selected: false,
        decimalOdds: 2,
      })),
      labelSelections: [
        { label: "", decimalOdds: 2 },
        { label: "", decimalOdds: 2 },
      ],
    },
  });

  const {
    fields: labelFields,
    append,
    remove,
    replace,
  } = useFieldArray({
    control: form.control,
    name: "labelSelections",
  });

  const selectionType = form.watch("selectionType");
  const teamSelections = form.watch("teamSelections");

  useEffect(() => {
    form.setValue(
      "teamSelections",
      teams.map((team) => ({
        teamId: team.id,
        selected: false,
        decimalOdds: 2,
      })),
    );
  }, [teams, form]);

  const allSelected =
    teams.length > 0 &&
    teamSelections.length > 0 &&
    teamSelections.every((team) => team.selected);

  const toggleTeam = (teamId: string, checked: boolean) => {
    const current = form.getValues("teamSelections");

    form.setValue(
      "teamSelections",
      current.map((team) =>
        team.teamId === teamId ? { ...team, selected: checked } : team,
      ),
      { shouldValidate: true },
    );
  };

  const toggleSelectAllTeams = (checked: boolean) => {
    const current = form.getValues("teamSelections");

    form.setValue(
      "teamSelections",
      current.map((team) => ({
        ...team,
        selected: checked,
      })),
      { shouldValidate: true },
    );
  };

  const handleSelectionTypeChange = (type: "teams" | "labels") => {
    form.setValue("selectionType", type, { shouldValidate: true });

    if (type === "teams") {
      replace([
        { label: "", decimalOdds: 2 },
        { label: "", decimalOdds: 2 },
      ]);
    } else {
      form.setValue(
        "teamSelections",
        form.getValues("teamSelections").map((team) => ({
          ...team,
          selected: false,
        })),
        { shouldValidate: true },
      );
    }
  };

  async function onSubmit(values: AddMarketFormValues) {
    const payload =
      values.selectionType === "teams"
        ? {
            name: values.name,
            teamSelections: values.teamSelections
              .filter((team) => team.selected)
              .map((team) => ({
                teamId: team.teamId,
                decimalOdds: team.decimalOdds,
              })),
          }
        : {
            name: values.name,
            labelSelections: values.labelSelections
              .filter((label) => label.label.trim().length > 0)
              .map((label) => ({
                label: label.label.trim(),
                decimalOdds: label.decimalOdds,
              })),
          };

    await apiFetch(`/games/${gameId}/markets`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    form.reset({
      name: "",
      selectionType: teams.length > 0 ? "teams" : "labels",
      teamSelections: teams.map((team) => ({
        teamId: team.id,
        selected: false,
        decimalOdds: 2,
      })),
      labelSelections: [
        { label: "", decimalOdds: 2 },
        { label: "", decimalOdds: 2 },
      ],
    });

    setIsForm(false);
  }

  return (
    <div className={cn("bg-muted border-dashed border-4 rounded-md border-accent flex justify-center items-center py-6", isAdmin ? "" : "hidden")}>
      {!isForm && (
        <Button size="icon-lg" variant="ghost" onClick={() => setIsForm(true)}>
          <Plus />
        </Button>
      )}

      {isForm && (
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log("FORM ERRORS", errors);
          })}
          className="w-full max-w-xl space-y-4 px-4"
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Which team will win?"
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    required
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Selection type</FieldLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectionType === "teams" ? "default" : "outline"}
                  onClick={() => handleSelectionTypeChange("teams")}
                >
                  Use teams
                </Button>
                <Button
                  type="button"
                  variant={selectionType === "labels" ? "default" : "outline"}
                  onClick={() => handleSelectionTypeChange("labels")}
                >
                  Use custom labels
                </Button>
              </div>
            </Field>

            {selectionType === "teams" && (
              <Field data-invalid={!!form.formState.errors.teamSelections}>
                <FieldLabel>Teams</FieldLabel>

                <div className="space-y-3 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-teams"
                      checked={allSelected}
                      onCheckedChange={(checked) =>
                        toggleSelectAllTeams(Boolean(checked))
                      }
                    />
                    <Label htmlFor="select-all-teams" className="text-sm font-medium">
                      Select all
                    </Label>
                  </div>

                  <div className="grid gap-3">
                    {teams.map((team, index) => {
                      const selection = teamSelections[index];
                      const checked = selection?.selected ?? false;

                      return (
                        <div
                          key={team.id}
                          className="grid grid-cols-[auto_1fr_120px] items-center gap-3"
                        >
                          <Checkbox
                            id={team.id}
                            checked={checked}
                            onCheckedChange={(value) =>
                              toggleTeam(team.id, Boolean(value))
                            }
                          />

                          <Label htmlFor={team.id} className="text-sm">
                            {team.name}
                          </Label>

                          <Controller
                            control={form.control}
                            name={`teamSelections.${index}.decimalOdds`}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="1.01"
                                disabled={!checked}
                                placeholder="2.00"
                              />
                            )}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {form.formState.errors.teamSelections && (
                  <FieldError errors={[form.formState.errors.teamSelections]} />
                )}
              </Field>
            )}

            {selectionType === "labels" && (
              <Field data-invalid={!!form.formState.errors.labelSelections}>
                <FieldLabel>Labels</FieldLabel>

                <div className="space-y-2 rounded-md border p-3">
                  {labelFields.map((labelField, index) => (
                    <div
                      key={labelField.id}
                      className="grid grid-cols-[1fr_120px_auto] items-center gap-2"
                    >
                      <Controller
                        control={form.control}
                        name={`labelSelections.${index}.label`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={`Option ${index + 1}`}
                          />
                        )}
                      />

                      <Controller
                        control={form.control}
                        name={`labelSelections.${index}.decimalOdds`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="1.01"
                            placeholder="2.00"
                          />
                        )}
                      />

                      {labelFields.length > 2 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ label: "", decimalOdds: 2 })}
                  >
                    Add label
                  </Button>
                </div>

                {form.formState.errors.labelSelections && (
                  <FieldError errors={[form.formState.errors.labelSelections]} />
                )}
              </Field>
            )}
          </FieldGroup>

          <div className="flex gap-2 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Market</Button>
          </div>
        </form>
      )}
    </div>
  );
};