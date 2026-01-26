import StreamView from "../components/StreamView";


interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
  spaceId:string
}


const REFRESH_INTERVAL_MS = 10 * 1000;

const creatorId = "d09b94a7-8e82-4023-9b1d-2c7b28fc9b09"

export default function Compenent() {
  return <StreamView creatorId= {creatorId}/>
}