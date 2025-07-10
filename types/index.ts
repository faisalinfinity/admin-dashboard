export interface Listing {
  id: number;
  car: string;
  status: 'pending' | 'approved' | 'rejected';
}
