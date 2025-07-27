import { CurrentConditions } from "app/components/current-conditions/current-conditions.type";

export interface ConditionsAndZip {
  zip: string;
  data: CurrentConditions;
}
