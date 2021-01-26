export class Card {
  id: String
  blockedIds: String[]
  blocks: Card[]

  constructor(id: String, blockedIds: String[]) {
    this.id = id
    this.blockedIds = blockedIds
  }

  updateBlockedCards() {
    console.log("updating blocked cards")
  }

}