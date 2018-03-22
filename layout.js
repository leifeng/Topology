import * as d3 from 'd3';
import state from './state';
class Layout {
  constructor(wrapper) {
    this.svg = wrapper.svg;
    this.linksWrapper = wrapper.linksWrapper;
    this.nodesWrapper = wrapper.nodesWrapper;
    this.menuWrapper = wrapper.menuWrapper;
    this.linkDom = null;
    this.nodeDom = null;
    this._init();
    return this;
  }
  _init() {
    this.simulation = d3
      .forceSimulation(state.nodes)
      .force('charge', d3.forceManyBody())
      // .force('center', d3.forceCenter(this.svg.property('clientWidth') / 2, this.svg.property('clientHeight') / 2))
      .on('tick', this._ticked);
  }
  _mouseoverNode(d) {
    if (d.source) {
      d3.select('#node-' + d.source.id).classed('svg-hover', true);
      d3.select('#node-' + d.target.id).classed('svg-hover', true);
    }
    d3.select('#' + this.id).classed('svg-hover', true);
  }
  _mouseoutNode(d) {
    if (d.source) {
      d3.select('#node-' + d.source.id).classed('svg-hover', false);
      d3.select('#node-' + d.target.id).classed('svg-hover', false);
    }
    d3.select('#' + this.id).classed('svg-hover', false);
  }
  _dragstarted = d => {
    d3.event.active || this.simulation.alphaTarget(0.3).restart(),
      (d3.event.subject.fx = d3.event.subject.x),
      (d3.event.subject.fy = d3.event.subject.y);
  };
  _dragged = d => {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  };
  _contextmenu = obj => {
    let data = [];
    if (obj.source) {
      data = state.menus.filter(item => item.type === 'link');
    } else {
      data = state.menus.filter(item => item.type === obj.type);
    }
    if (data.length) {
      const event = d3.event;
      event.preventDefault();
      this.menuWrapper
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 'px')
        .style('display', 'block');
      const selection = this.menuWrapper.selectAll('a').data(data[0].menuItems);
      const menu_update = selection;
      selection
        .enter()
        .append('a')
        .merge(menu_update)
        .html(d => d.name)
        .on('click', d => {
          state.menusHandle(obj, d.value);
          this.menuWrapper.style('display', 'none');
        });
      selection.exit().remove();
    }
  };
  arcPath(leftHand, d) {
    let start = leftHand ? d.source : d.target,
      end = leftHand ? d.target : d.source,
      dx = end.x - start.x,
      dy = end.y - start.y,
      dr = Math.sqrt(dx * dx + dy * dy),
      sweep = leftHand ? 0 : 1;
    return 'M' + start.x + ',' + start.y + 'A' + dr + ',' + dr + ' 0 0,' + sweep + ' ' + end.x + ',' + end.y;
  }
  _ticked = () => {
    this.nodeDom.attr('transform', d => {
      d.fx = d.x;
      d.fy = d.y;
      return `translate(${d.x},${d.y})`;
    });
    this.linkDom.attr('d', d => this.arcPath(true, d));
    // links
    //   .attr('x1', function(d) {
    //     return d.source.x;
    //   })
    //   .attr('y1', function(d) {
    //     return d.source.y;
    //   })
    //   .attr('x2', function(d) {
    //     return d.target.x;
    //   })
    //   .attr('y2', function(d) {
    //     return d.target.y;
    //   });
  };
  _makeNode(nodes) {
    const selection = this.nodesWrapper.selectAll('g.node').data(nodes);
    const node_update = selection.attr('class', 'node update');
    selection.exit().remove();
    const node = selection
      .enter()
      .append('g')
      .attr('class', 'node enter')
      .attr('id', d => 'node-' + d.id)
      .merge(node_update)
      .attr('transform', d => {
        return `translate(${d.x},${d.y})`;
      })
      .on('mouseover', this._mouseoverNode)
      .on('mouseout', this._mouseoutNode)
      .call(
        d3
          .drag()
          .on('start', this._dragstarted)
          .on('drag', this._dragged)
      )
      .on('contextmenu', this._contextmenu);

    node.selectAll('.dot').remove();
    node.selectAll('.icon').remove();
    node.selectAll('.info').remove();
    node
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 30)
      .attr('fill', '#fff')
      .attr('stroke', '#2ca02c');
    node
      .append('use')
      .attr('class', 'icon')
      .attr('xlink:href', d => `#${d.type}`)
      .attr('transform', `translate(-25,-25) scale(0.6)`);
    const g = node.append('g').attr('class', 'info');
    g
      .append('text')
      .attr('x', 35)
      .attr('y', -10)
      .attr('class', 'name')
      .text(d => d.name);
    g
      .append('text')
      .attr('x', 35)
      .attr('y', 10)
      .attr('class', 'status')
      .text(d => d.status);

    return node;
  }
  _makeLink(links) {
    const selection = this.linksWrapper.selectAll('path.line').data(links);
    const line_update = selection.attr('class', 'line update');
    selection.exit().remove();
    const link = selection
      .enter()
      .lower()
      .append('svg:path')
      .attr('class', 'line enter')
      .attr('id', d => 'line-' + d.id)
      .attr('stroke-width', 4)
      .attr('stroke', '#aaa')
      .attr('fill', 'none')
      .merge(line_update)
      .on('mouseover', this._mouseoverNode)
      .on('mouseout', this._mouseoutNode)
      .on('contextmenu', this._contextmenu);

    return link;
  }

  updateView = () => {
    const links = JSON.parse(JSON.stringify(state.links));
    // console.log('nodes', state.nodes, nodes);
    // console.log('links', state.links, links);
    this.simulation.nodes(state.nodes);
    this.simulation.force('link', d3.forceLink(links).id(d => d.id));
    this.nodeDom = this._makeNode(state.nodes);
    this.linkDom = this._makeLink(links);
  };
}
export default Layout;
