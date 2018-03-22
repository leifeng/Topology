import state from './state';
const uuidv4 = require('uuid/v4');
const _x = {
  server: 100,
  router: 400,
  internat: 700,
  firewarll: 1000,
  network: 1300
};
class Action {
  constructor(layout) {
    this.layout = layout;
    return this;
  }
  _y(nodes, item) {
    let y = 0;
    nodes.filter(_item => _item.type === item.type).map((_item, index) => {
      if (_item.id === item.id) {
        y = index;
      }
    });
    return y;
  }
  _placement(nodes) {
    const _nodes = nodes.map(item => {
      let x = _x[item.type];
      let y = this._y(nodes, item) * 100;
      let n = 0;

      return {...item, x, y};
    });
    return _nodes;
  }
  loadData({nodes, links, menus}) {
    state.nodes = this._placement(nodes);
    // state.links = links.map(item => {
    //   return {...item, id: uuidv4()};
    // });
    setTimeout(() => {
      state.links = links.map(item => {
        return {...item, id: uuidv4()};
      });
      this.layout.updateView();
    }, 1000);
    this.layout.updateView();
  }
  setMenu({menus, handle}) {
    state.menus = menus;
    state.menusHandle = handle;
  }
  addNode(node) {
    state.nodes = [
      ...state.nodes,
      {...node, x: _x[node.type], y: state.nodes.filter(item => item.type == node.type).length * 100}
    ];
    console.log({
      ...node,
      x: _x[node.type],
      y: state.nodes.filter(item => item.type == node.type).length * 100
    });
    this.layout.updateView();
  }
  addLink(link) {
    if (state.links.some(item => item.source === link.source && item.target === link.target)) {
      console.error('已存在连接');
      return;
    }
    if (state.nodes.some(item => item.id === link.source) && state.nodes.some(item => item.id === link.target)) {
      state.links = [...state.links, {...link, id: uuidv4()}];
      this.layout.updateView();
      return;
    }
    console.error('缺少node');
  }
  updateNode(id, newState) {
    if (!state.nodes.some(item => item.id === id)) {
      console.error('该node不存在');
      return;
    }
    state.nodes = state.nodes.map(item => {
      if (item.id === id) {
        return {...item, ...newState};
      }
      return item;
    });
    this.layout.updateView();
  }
  removeNode(id) {
    if (state.links.some(item => item.source === id || item.target === id)) {
      console.error('存在关联无法删除');
      return;
    }
    state.nodes = state.nodes.filter(item => item.id !== id);
    this.layout.updateView();
  }
  removeLink(id) {
    state.links = state.links.filter(item => item.id !== id);
    this.layout.updateView();
  }
}
export default Action;
