export interface IListItem {
  id: number;
  shareId: string;
  title: string;
  createdAt: string;
  itemCount: number;
}

export interface IListDetailsItem {
  id: number;
  title: string;
  quantity: number;
  unit: string;
  notes: string;
}