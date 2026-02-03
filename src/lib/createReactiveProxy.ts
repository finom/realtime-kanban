type Listener<T = unknown> = (value: T) => void;

class UniversalEventEmitter {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: string, value: unknown): void {
    this.listeners.get(event)?.forEach(listener => listener(value));
  }
}

export function createReactiveProxy<T extends object>(target: T): {
  proxy: T;
  emitter: UniversalEventEmitter;
} {
  const emitter = new UniversalEventEmitter();

  function createProxy<U extends object>(obj: U, path: string = ''): U {
    return new Proxy(obj, {
      get(target, prop) {
        if (typeof prop === 'symbol') return target[prop as keyof typeof target];

        const value = target[prop as keyof typeof target];
        const currentPath = path ? `${path}.${String(prop)}` : String(prop);

        if (value !== null && typeof value === 'object') {
          return createProxy(value as object, currentPath);
        }

        return value;
      },

      set(target, prop, value) {
        const currentPath = path ? `${path}.${String(prop)}` : String(prop);
        target[prop as keyof typeof target] = value;
        emitter.emit(currentPath, value);
        return true;
      }
    });
  }

  return {
    proxy: createProxy(target),
    emitter
  };
}
/* 
// Usage
const { proxy: data, emitter } = createReactiveProxy({ 
  foo: { bar: { baz: 0 } },
  name: 'test'
});

emitter.on('foo.bar.baz', (value) => {
  console.log('foo.bar.baz changed to:', value);
});

data.foo.bar.baz = 123; // Emits "foo.bar.baz" with value 123 */