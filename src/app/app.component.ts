import { AfterViewInit, Component } from '@angular/core';
import * as dracula from 'graphdracula';
import { Card } from './card'

const Graph = dracula.Graph;
const Renderer = dracula.Renderer.Raphael;
const Layout = dracula.Layout.Spring;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'jira-graph-web';
  cards: Card[]
  renderer: any

  ngAfterViewInit() {
    this.renderDefaultGraph()
  }

  onFileChange(event: any) {
    const file = event.target.files[0]
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // const lines = (fileReader.result as String).replace("\"\\(.*?\\)\"", "").split("\n")
      const lines = (fileReader.result as String).split("\n")
      console.log(lines);
      const blockedColumns = this.findBlockedColumns(lines[0])
      const idColumn = this.findIdColumn(lines[0])

      this.cards = lines
        .slice(1, lines.length)
        .map(line => this.parseCard(line, idColumn, blockedColumns))
        .filter(card => card.id.length > 1)

      this.cards.forEach(card => {
        card.updateBlockedCards()
        console.log(card)
      })

      this.reRenderGraph()
    }
    fileReader.readAsText(file);
  }

  findIdColumn(line: string): number {
    const row = line.split(",")
    var i
    for (i = 1; i < row.length; i++) {
      if (row[i] == "Issue Key") {
        return i
      }
    }
    return -1
  }

  findBlockedColumns(line: string): number[] {
    const row = line.split(",")
    const indices = []
    var i
    for (i = 1; i < row.length; i++) {
      if (row[i].includes("Blocks")) {
        indices.push(i)
      }
    }

    return indices
  }

  parseCard(line: String, idColumn: number, blockedColumns: number[]): Card {
    const row: String[] = line.split(",")
    const blockedIds = blockedColumns.map(i => { return row[i] }).filter(value => value != null && value.length > 1)
    return new Card(row[idColumn], blockedIds)
  }

  reRenderGraph() {
    const graph = new Graph();

    this.cards.forEach(card => {
      // graph.addNode(card.id, { label: "<a href=\"https://www.w3schools.com\">Visit W3Schools.com!</a>" });
      graph.addNode(card.id, { label: card.id });
      card.blockedIds.forEach(blockedId => {
        graph.addEdge(card.id, blockedId, { directed: true });
      })
    })

    this.renderGraph(graph)
  }

  renderDefaultGraph() {
    const graph = new Graph();

    graph.addEdge('Banana', 'Apple');
    graph.addEdge('Apple', 'Kiwi');
    graph.addEdge('Apple', 'Dragonfruit');
    graph.addEdge('Dragonfruit', 'Banana');
    graph.addEdge('Kiwi', 'Banana');

    this.renderGraph(graph)
  }


  renderGraph(graph) {
    // if (this.renderer != null) {
    //   this.renderer.clear();
    // }
    const layout = new Layout(graph);
    this.renderer = new Renderer('#paper', graph, 1000, 600);
    this.renderer.draw();
  }


}


