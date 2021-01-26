import { AfterViewInit, Component } from '@angular/core';
import * as dracula from 'graphdracula';
import { Card } from './card'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'jira-graph-web';
  cards: Card[]

  ngAfterViewInit() {
    this.renderDefaultGraph()
  }

  onFileChange(event: any) {
    const file = event.target.files[0]
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      const lines = (fileReader.result as String).split("\n")
      this.cards = lines.slice(1, lines.length).map(row => {
        const rowValues = row.split(",")
        const blockedIds = rowValues.slice(1, rowValues.length).filter(value => value != "")
        return new Card(rowValues[0], blockedIds)
      })
      this.cards.forEach(card => {
        card.updateBlockedCards()
        console.log(card)
      })
      this.reRenderGraph()
    }
    fileReader.readAsText(file);
  }



  renderDefaultGraph() {
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

  reRenderGraph() {
    const Graph = dracula.Graph;
    const Renderer = dracula.Renderer.Raphael;
    const Layout = dracula.Layout.Spring;

    const graph = new Graph();

    this.cards.forEach(card => {
      card.blockedIds.forEach(blockedId => {
        graph.addEdge(card.id, blockedId);
      })
    })

    const layout = new Layout(graph);
    const renderer = new Renderer('#paper', graph, 1000, 600);
    renderer.draw();
  }

}


