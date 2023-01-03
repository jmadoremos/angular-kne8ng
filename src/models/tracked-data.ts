export interface TrackedData<T> {
  state: 'original' | 'added' | 'altered';
  data: T;
  modified?: T;
}
