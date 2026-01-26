import StreamView from "@/app/components/StreamView";

export default function ({
    params: {
        creatorId
    }
}: {
    params: {
        creatorId: String;
    }
}) {
    return <div>
        <StreamView creatorId = {creatorId} />
    </div>
}