import { AfterViewInit, Component } from '@angular/core';
import * as dracula from 'graphdracula';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'jira-graph-web';

  ngAfterViewInit() {
    renderGraph()
  }
}



function renderGraph() {
  const Graph = dracula.Graph;
  const Renderer = dracula.Renderer.Raphael;
  const Layout = dracula.Layout.Spring;

  const graph = new Graph();

  graph.addEdge('Banana', 'Apple');
  graph.addEdge('Apple', 'Kiwi');
  graph.addEdge('Apple', 'Dragonfruit');
  graph.addEdge('Dragonfruit', 'Banana');
  graph.addEdge('Kiwi', 'Banana');

  const layout = new Layout(graph);
  const renderer = new Renderer('#paper', graph, 1000, 600);
  renderer.draw();
}