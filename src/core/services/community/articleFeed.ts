import { feedUrl } from '@/config'
import axios from 'axios'

export const ArticleFeed = ({
    async reqFeed() {
        let resBody: any
        if (process.env.NODE_ENV === "development") {
            resBody = await axios.get("/nemflash", { params: {} })
            return resBody.data
        }
        resBody = await axios.get(feedUrl, { params: {} })
        return resBody.data
    }
})