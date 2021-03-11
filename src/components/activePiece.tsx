import React = require("react");
import PlayerId from "../server/PlayerId";
import GamePiece from "../shared/types/GamePiece";
import Piece from "./gamePiece";

interface ActivePieceProps {
    piece: GamePiece;
    playerId: PlayerId;
    rotate: (piece: GamePiece, reverse?: boolean) => any;
}


function ActivePiece(props: ActivePieceProps) {
    const [x, setX] = React.useState<number>(-1000);
    const [y, setY] = React.useState<number>(0);
    const windowListenerRef = React.useRef(props.piece);

    React.useEffect(() => {
        windowListenerRef.current = props.piece;
    })

    const removeHooks = () => {
        document.removeEventListener("mousemove", mouseMoveListener)
        document.removeEventListener("wheel", mouseWheelListener)
    }

    const mouseMoveListener = (e: MouseEvent) => {
        setX(e.pageX);
        setY(e.pageY);
    }

    const mouseWheelListener = (e: WheelEvent) => {
        if (e.deltaY > 0) {
            props.rotate(windowListenerRef.current);
        } else {
            props.rotate(windowListenerRef.current, true);
        }
    }

    React.useEffect(() => {
        document.addEventListener("mousemove", mouseMoveListener);
        document.addEventListener("wheel", mouseWheelListener);

        return removeHooks;
    }, [])

    return <div
        data-active-piece
        className={"active-piece"}
        style={{
            position: "absolute",
            top: `${y - 24}px`,
            left: `${x - 24}px`,
        }}>
        <Piece
            piece={props.piece}
            onClick={() => { }}
            playerId={props.playerId}
        />
    </div>
}

export default ActivePiece;