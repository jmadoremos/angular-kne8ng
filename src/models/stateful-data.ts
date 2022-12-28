export interface StatefulData<T> {
  state: 'original' | 'added' | 'altered';
  data: T;
}
