const state = new Proxy(
  {
    nodes: [],
    links: [],
    menus: [],
    menusHandle: null
  },
  {
    get(target, name) {
      // console.log('get', name);
      if (name in target) {
        return target[name];
      } else {
        throw new ReferenceError('Property "' + name + '" does not exist.');
      }
    },
    set(obj, prop, value) {
      console.log('set', prop);
      console.log('set', value);
      obj[prop] = value;
      return true;
    }
  }
);
export default state;
