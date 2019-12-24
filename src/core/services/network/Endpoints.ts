import {localRead} from '@/core/utils/utils'
import {Store} from 'vuex'
import {AppState, Endpoint} from '@/core/model'
import {defaultNodeList} from "@/config/view/node"

export class Endpoints {
  nodeList: Endpoint[]
  activeNode: string

  static async initialize(store: Store<AppState>): Promise<void> {
    try {
      await new Endpoints(store).init()
    } catch (error) {
      throw new Error(error)
    }
  }

  constructor(private readonly store: Store<AppState>) {
    this.nodeList = this.setNodeListFromLocalStorage()
    this.activeNode = this.getActiveNodeFromLocalStorage() || this.nodeList[0].value
  }

  private setNodeListFromLocalStorage(): Endpoint[] {
    try {
      const nodeList = localRead('nodeList')
      const parsedNodeList = JSON.parse(nodeList)
      if (
        parsedNodeList === ''
        || !parsedNodeList.length
        || parsedNodeList.constructor !== Array
      ) {
        this.setDefaultNodeListInLocalStorage()
        return defaultNodeList
      }
      this.store.commit('SET_NODE_LIST', parsedNodeList)
      return parsedNodeList
    } catch (error) {
      this.setDefaultNodeListInLocalStorage()
      return defaultNodeList
    }
  }

  private getActiveNodeFromLocalStorage(): string {
    const node = localRead('activeNode')
    if (node === '' || typeof node !== 'string') return null
    return node
  }

  setDefaultNodeListInLocalStorage(): void {
    this.store.commit('SET_NODE_LIST', defaultNodeList)
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      this.store.commit('SET_NODE', this.activeNode)
      resolve()
    })
  }
}
