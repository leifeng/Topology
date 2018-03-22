import * as d3 from 'd3';

class Wrapper {
  constructor(container, assets) {
    this.svg = null;
    this.linksWrapper = null;
    this.nodesWrapper = null;
    this._initSvg(container);
    this._loadAssets(assets);
    return this;
  }
  _initSvg(container) {
    this.menuWrapper = d3
      .select(container)
      .append('div')
      .attr('class', 'menu-wrapper');
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('class', 'topology')
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 2, 2])
          .on('zoom', this._zoomed)
      )
      .on('dblclick.zoom', null)
      .on('contextmenu', () => {
        d3.event.preventDefault();
        const target = d3.event.target;
        if (target.nodeName === 'rect') {
          this.menuWrapper.style('display', 'none');
        }
      })
      .on('click', () => {
        this.menuWrapper.style('display', 'none');
      });
  }
  _loadAssets(assets) {
    const defs = this.svg.append('defs');
    defs
      .append('pattern')
      .attr('id', 'background')
      .attr('width', 12)
      .attr('height', 12)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('path')
      .attr('fill', '#fff')
      .attr('stroke', '#eee')
      .attr('stroke-width', 1)
      .attr('d', 'M 0 0 L 12 0 12 12 0 12 z');
    defs
      .selectAll('g')
      .data(assets)
      .enter()
      .append('g')
      .attr('id', d => d.type)
      .append('image')
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('xlink:href', d => d.url);
    this._loadBackground();
    this._loadWrapper();
  }
  _loadBackground() {
    this.svg
      .append('rect')
      .attr('class', 'background')
      .attr('fill', 'url(#background)')
      .attr('width', '100%')
      .attr('height', '100%');
  }
  _loadWrapper() {
    this.wrapper = this.svg.append('g').attr('class', 'wrapper');
    this.linksWrapper = this.wrapper.append('g').attr('class', 'links');
    this.nodesWrapper = this.wrapper.append('g').attr('class', 'nodes');
  }
  _zoomed = () => {
    this.wrapper.attr('transform', d3.event.transform);
    this.menuWrapper.style('display', 'none');
  };
}

export default Wrapper;
