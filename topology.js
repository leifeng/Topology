import Action from './action';
import Wrapper from './Wrapper';
import Layout from './layout';

class Topology {
  constructor(container, assets) {
    this.wrapper = new Wrapper(container, assets);
    this.layout = new Layout(this.wrapper);
    this.action = new Action(this.layout);
    return this;
  }
  loadData(data) {
    this.action.loadData(data);
  }
  setMenu(data) {
    this.action.setMenu(data);
  }
  addNode(node) {
    this.action.addNode(node);
  }
  updateNode(id, newState) {
    this.action.updateNode(id, newState);
  }
  removeNode(id) {
    this.action.removeNode(id);
  }
  addLink(link) {
    this.action.addLink(link);
  }
  removeLink(id) {
    this.action.removeLink(id);
  }
}
export default Topology;
window.Topology = Topology;
