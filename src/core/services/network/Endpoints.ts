import {localRead} from '@/core/utils/utils'
import {Store} from 'vuex'
import {AppState, Endpoint} from '@/core/model'
import {defaultNodeList} from "@/config/view/node"
import {NetworkType} from "nem2-sdk"
import {defaultNetworkConfig} from "@/config"

export class Endpoints {
  nodeList: Endpoint[]

  constructor(private readonly store: Store<AppState>) {
    this.nodeList = this.setNodeListFromLocalStorage()
  }

  init(): Promise<void> {
    return new Promise((resolve) => {
      Endpoints.setNodeInfo(defaultNetworkConfig.DEFAULT_NETWORK_TYPE, this.store )
      resolve()
    })
  }

  static async initialize(store: Store<AppState>): Promise<void> {
    try {
      await new Endpoints(store).init()
    } catch (error) {
      throw new Error(error)
    }
  }


  public static setNodeInfo(networkType:NetworkType,store:Store<any>){
    const localNodeList = JSON.parse(localRead('nodeList') || '[]')
    const activeNodeMap = JSON.parse(localRead('activeNodeMap') || '{}')
    const previousActiveNode = activeNodeMap[networkType]
    const defaultNode = defaultNodeList.find(item=>item.networkType == networkType).value
    const node = previousActiveNode || defaultNode

    store.commit('SET_NODE', {node, networkType})
    store.commit('SET_NODE_LIST',localNodeList.length> 0 ? localNodeList : defaultNodeList)
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
  setDefaultNodeListInLocalStorage(): void {
    this.store.commit('SET_NODE_LIST', defaultNodeList)
  }
}
