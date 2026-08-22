import { DomainError } from "./types.js";

export type Envoy = {
  id: string;
  displayName: string;
  frozen: boolean;
};

export function createEnvoy(id: string, displayName: string): Envoy {
  return { id, displayName, frozen: false };
}

export function freeze(envoy: Envoy): Envoy {
  return { ...envoy, frozen: true };
}

export function unfreeze(envoy: Envoy): Envoy {
  return { ...envoy, frozen: false };
}

export function assertCanPropose(envoy: Envoy): void {
  if (envoy.frozen) {
    throw new DomainError(`Envoy ${envoy.id} is frozen; cannot propose`);
  }
}
