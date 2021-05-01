import React = require("react");
import PlayerId from "../shared/types/PlayerId";
import GamePiece from "../shared/types/GamePiece";
import Piece from "./gamePiece";

interface ActivePieceProps {
    piece: GamePiece | undefined;
    rotate: (piece: GamePiece, reverse?: boolean) => any;
    flip: (piece: GamePiece) => any;
}

const DEBOUNCE_TIMEOUT_MS = 300;

function ActivePieceContainer(props: ActivePieceProps) {
    if (props.piece) {
        return <ActivePiece {...props} />;
    } else {
        return <></>;
    }
}

function ActivePiece(props: ActivePieceProps) {
    const [x, setX] = React.useState<number>(-1000);
    const [y, setY] = React.useState<number>(0);
    const windowListenerRef = React.useRef(props.piece!);

    React.useEffect(() => {
        windowListenerRef.current = props.piece!;
    });

    const removeHooks = () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("wheel", mouseWheelListener);
        document.removeEventListener("mousedown", mouseDownListener);
    };

    const mouseMoveListener = (e: MouseEvent) => {
        setX(e.pageX);
        setY(e.pageY);
    };

    const mouseWheelListener = (e: WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            debounce(() => props.rotate(windowListenerRef.current));
        } else {
            debounce(() => props.rotate(windowListenerRef.current, true));
        }
    };

    const mouseDownListener = (e: MouseEvent) => {
        if (e.button == 2) {
            e.preventDefault();
            props.flip(windowListenerRef.current);
        }
    };

    React.useEffect(() => {
        document.addEventListener("mousemove", mouseMoveListener);
        document.addEventListener("wheel", mouseWheelListener, {
            passive: false
        });
        document.addEventListener("mousedown", mouseDownListener);

        return removeHooks;
    }, []);

    return (
        <div
            data-active-piece
            className={"active-piece"}
            style={{
                position: "absolute",
                top: `${y - 24}px`,
                left: `${x - 24}px`
            }}
        >
            <Piece
                piece={props.piece!}
                onClick={() => {}}
                playerId={props.piece!.playerId}
            />
        </div>
    );
}

let debounceIndicator = false;

const debounce = (action: Function) => {
    if (!debounceIndicator) {
        debounceIndicator = true;
        action();
        setTimeout(() => (debounceIndicator = false), DEBOUNCE_TIMEOUT_MS);
    }
};

export default ActivePieceContainer;
