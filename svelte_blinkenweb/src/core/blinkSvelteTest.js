import { writable } from "svelte/store";


class Emulator {
  constructor(onStateChange, onSpeedChange, onTemperatureChange) {
    this.state = "initial";
    this.speed = 0;
    this.temperature = 20;

    this.onStateChange = onStateChange;
    this.onSpeedChange = onSpeedChange;
    this.onTemperatureChange = onTemperatureChange;

    // Simulate state changes
    setInterval(() => {
      this.state = Math.random() > 0.5 ? "running" : "stopped";
      this.onStateChange(this.state);
    }, 2000);

    // Simulate speed changes
    setInterval(() => {
      this.speed = Math.floor(Math.random() * 100);
      this.onSpeedChange(this.speed);
    }, 1500);

    // Simulate temperature changes
    setInterval(() => {
      this.temperature = 20 + Math.floor(Math.random() * 10);
      this.onTemperatureChange(this.temperature);
    }, 3000);
  }
}

// Create a Svelte store to manage multiple reactive properties of the emulator
export function createEmulatorStore() {
  // Step 1: Define a writable store with an object holding multiple properties
  const { subscribe, update } = writable({
    state: "initial",
    speed: 0,
    temperature: 20
  });

  // Step 2: Instantiate the Emulator class and pass multiple callbacks
  const emulator = new Emulator(
    (newState) => update((store) => ({ ...store, state: newState })), // Update the `state` property
    (newSpeed) => update((store) => ({ ...store, speed: newSpeed })), // Update the `speed` property
    (newTemperature) => update((store) => ({ ...store, temperature: newTemperature })) // Update the `temperature` property
  );

  // Step 3: Return an object with the `subscribe` method and, optionally, other methods to control the emulator
  return {
    subscribe,
    // Additional methods to interact with the emulator can be added here, like reset or setProperty
    reset() {
      update(() => ({
        state: "initial",
        speed: 0,
        temperature: 20,
      }));
    },
  };
}

// Create a singleton store instance
export const emulatorStore = createEmulatorStore();

