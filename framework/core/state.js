let state = [];
let effects = [];
let currentIndex = 0;
let currentEffectIndex = 0;

function useState(initialValue) {
  const index = currentIndex;

  if (state[index] === undefined) {
    state[index] = initialValue;
  }

  function setState(newValue) {
    state[index] = newValue;
    render();
  }

  currentIndex++;
  return [state[index], setState];
}

function useEffect(callback, deps) {
  const index = currentEffectIndex;
  const prevDeps = effects[index];

  const hasChanged = !prevDeps || deps.some((dep, i) => dep !== prevDeps[i]);
  if (hasChanged) {
    callback();
    effects[index] = deps;
  }

  currentEffectIndex++;
}