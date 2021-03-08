import React = require("react");
import PlayerId from "../server/PlayerId";
import Piece from "./gamePiece";

interface ActivePieceProps {
    pieceId: number;
    playerId: PlayerId;
}


function ActivePiece(props: ActivePieceProps) {
    const [x, setX] = React.useState<number>();
    const [y, setY] = React.useState<number>();

    const removeHooks = () => {
        document.removeEventListener("mousemove", mouseListener)
    }

    const mouseListener = (e: MouseEvent) => {
        setX(e.pageX);
        setY(e.pageY);
        console.log(e.offsetX, e.offsetY);
    }

    React.useEffect(() => {
        document.addEventListener("mousemove", mouseListener);

        return removeHooks;
    }, [])

    if (x !== undefined && y !== undefined)
        return <div
            className={"active-piece"}
            style={{
                position: "absolute",
                top: `${y - 24}px`,
                left: `${x - 24}px`,
            }}>
            <Piece
                pieceId={props.pieceId}
                onClick={() => { }}
                playerId={props.playerId}
            />
        </div>
    else return <></>
}

export default ActivePiece;