"use client";

import { Button } from "@/components/ui/button";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

type Team = {
  id: string;
  name: string;
};

const formSchema = z
  .object({
    name: z.string().min(5, {
      message: "Name must be at least 5 characters",
    }),
    selectionType: z.enum(["teams", "labels"]),
    teamIds: z.array(z.string()),
    labels: z
      .array(
        z.object({
          value: z.string().trim(),
        }),
      ),
  })
  .superRefine((values, ctx) => {
    if (values.selectionType === "teams" && values.teamIds?.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["teamIds"],
        message: "Select at least one team",
      });
    }

    if (values.selectionType === "labels") {
      if (values.labels?.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["labels"],
          message: "Add at least one label",
        });
      }

      const normalized = values.labels
        .map((label) => label.value.trim().toLowerCase())
        .filter(Boolean);

      if (new Set(normalized).size !== normalized.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["labels"],
          message: "Labels must be unique",
        });
      }
    }
  });

export const AddMarket = ({ teams, gameId } : { teams: Team[], gameId: string }) => {
  const [isForm, setIsForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      selectionType: "teams",
      teamIds: [],
      labels: [{ value: "" }, { value: "" }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "labels",
  });

  const selectionType = form.watch("selectionType");
  const selectedTeamIds = form.watch("teamIds");

  const allSelected =
    teams.length > 0 && selectedTeamIds.length === teams.length;

  const toggleTeam = (teamId: string, checked: boolean) => {
    const current = form.getValues("teamIds");

    if (checked) {
      form.setValue("teamIds", [...current, teamId], { shouldValidate: true });
      return;
    }

    form.setValue(
      "teamIds",
      current.filter((id) => id !== teamId),
      { shouldValidate: true },
    );
  };

  const toggleSelectAllTeams = (checked: boolean) => {
    form.setValue(
      "teamIds",
      checked ? teams.map((team) => team.id) : [],
      { shouldValidate: true },
    );
  };

  const handleSelectionTypeChange = (type: "teams" | "labels") => {
    form.setValue("selectionType", type, { shouldValidate: true });

    if (type === "teams") {
      replace([{ value: "" }, { value: "" }]);
    } else {
      form.setValue("teamIds", [], { shouldValidate: true });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload =
      values.selectionType === "teams"
        ? {
            name: values.name,
            teamSelections: values.teamIds.map((teamId) => ({
              teamId,
            })),
          }
        : {
            name: values.name,
            labelSelections: values.labels
              .map((label) => label.value.trim())
              .filter(Boolean)
              .map((label) => ({
                label,
              })),
          };

    await apiFetch(`/games/${gameId}/markets`, {
      method: "GET",
      body: JSON.stringify({ ...payload })
    })
  }

  return (
    <div className="bg-muted border-dashed border-4 rounded-md border-accent flex justify-center items-center py-6">
      {!isForm && (
        <Button size="icon-lg" variant="ghost" onClick={() => setIsForm(true)}>
          <Plus />
        </Button>
      )}

      {isForm && (
        <form onSubmit={form.handleSubmit(
					onSubmit,
					(errors) => {
						console.log("FORM ERRORS", errors);
					}
				)} className="w-full max-w-xl space-y-4 px-4">
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
              <Field data-invalid={!!form.formState.errors.teamIds}>
                <FieldLabel>Teams</FieldLabel>

                <div className="space-y-3 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all-teams"
                      checked={allSelected}
                      onCheckedChange={(checked) => toggleSelectAllTeams(Boolean(checked))}
                    />
                    <Label htmlFor="select-all-teams" className="text-sm font-medium">
                      Select all
                    </Label>
                  </div>

                  <div className="grid gap-2">
                    {teams.map((team) => {
                      const checked = selectedTeamIds.includes(team.id);

                      return (
                        <div key={team.id} className="flex items-center gap-2">
                          <Checkbox
                            id={team.id}
                            checked={checked}
                            onCheckedChange={(value) => toggleTeam(team.id, Boolean(value))}
                          />
                          <Label htmlFor={team.id} className="text-sm">
                            {team.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {form.formState.errors.teamIds && (
                  <FieldError errors={[form.formState.errors.teamIds]} />
                )}
              </Field>
            )}

            {selectionType === "labels" && (
              <Field data-invalid={!!form.formState.errors.labels}>
                <FieldLabel>Labels</FieldLabel>

                <div className="space-y-2 rounded-md border p-3">
                  {fields.map((labelField, index) => (
                    <div key={labelField.id} className="flex items-center gap-2">
                      <Controller
                        control={form.control}
                        name={`labels.${index}.value`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder={`Option ${index + 1}`}
                          />
                        )}
                      />

                      {fields.length > 2 && (
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
                    onClick={() => append({ value: "" })}
                  >
                    Add label
                  </Button>
                </div>

                {form.formState.errors.labels && (
                  <FieldError errors={[form.formState.errors.labels]} />
                )}
              </Field>
            )}
          </FieldGroup>

          <div className="flex gap-2 py-4">
            <Button type="button" variant="outline" onClick={() => setIsForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Market</Button>
          </div>
        </form>
      )}
    </div>
  );
};