export interface Resource {
  id: string;
  name: string;
  quantity?: number;
  units?: string;
  cost: number;
  children?: Resource[];
}

export interface ResourceGroup {
  id: string;
  name: string;
  cost: number;
  resources: Resource[];
}

export interface CostSummary {
  groups: ResourceGroup[];
  totalCost: number;
}
