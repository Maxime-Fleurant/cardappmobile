import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Card {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly coverImage?: string;
  constructor(init: ModelInit<Card>);
  static copyOf(source: Card, mutator: (draft: MutableModel<Card>) => MutableModel<Card> | void): Card;
}