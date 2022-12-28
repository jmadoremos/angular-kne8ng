import { StatefulData } from './stateful-data';

export interface TrackedData<T> extends StatefulData<T> {
  original: T;
  modified?: T;
}
