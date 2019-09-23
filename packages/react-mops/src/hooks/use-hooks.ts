import React from "react";
import {rotationCursors} from "../cursors";
import {to360} from "../utils";

const OSX = "OSX";
const WINDOWS = "WINDOWS";
const LINUX = "LINUX";
const UNIX = "UNIX";
const NODE = "UNIX";

const getOS = () => {
	if ("navigator" in global) {
		if (navigator.appVersion.indexOf("Win") !== -1) {
			return WINDOWS;
		}
		if (navigator.appVersion.indexOf("Mac") !== -1) {
			return OSX;
		}
		if (navigator.appVersion.indexOf("X11") !== -1) {
			return UNIX;
		}
		if (navigator.appVersion.indexOf("Linux") !== -1) {
			return LINUX;
		}
	}
	return NODE;
};

const isOSX = () => getOS() === OSX;
/**
 *
 */
export const useMeta = () => {
	const [metaKey, setMetaKey] = React.useState(false);
	const key = isOSX ? "Meta" : "Control";
	const handleKeyDown = React.useCallback(
		(e: KeyboardEvent) => {
			if (e.key === key) {
				setMetaKey(true);
			}
		},
		[setMetaKey]
	);

	const handleKeyUp = React.useCallback(
		(e: KeyboardEvent) => {
			if (e.key === key) {
				setMetaKey(false);
			}
		},
		[setMetaKey]
	);

	const handleFocus = React.useCallback(() => {
		setMetaKey(false);
	}, [setMetaKey]);

	React.useEffect(() => {
		window.addEventListener("focus", handleFocus);
		window.addEventListener("blur", handleFocus);
		return () => {
			window.removeEventListener("focus", handleFocus);
			window.removeEventListener("blur", handleFocus);
		};
	}, [handleFocus]);

	React.useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	React.useEffect(() => {
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [handleKeyUp]);
	return metaKey;
};
export const useCursorSlice = currentRotation =>
	React.useCallback(
		n => {
			return (Math.round(to360(currentRotation.z) / 45) + n) % rotationCursors.length;
		},
		[currentRotation]
	);
export const useHandler = (handler, {currentSize, currentPosition, currentRotation}) =>
	React.useCallback(
		() =>
			handler &&
			handler({position: currentPosition, rotation: currentRotation, size: currentSize}),
		[handler, currentSize, currentPosition, currentRotation]
	);

export const useLoaded = setLoaded =>
	React.useEffect(() => {
		setLoaded(true);
	}, [setLoaded]);
export const useInitialSize = ({contentRef, setInitialSize, setSize}) =>
	React.useEffect(() => {
		if (contentRef && contentRef.current) {
			const {clientHeight: height, clientWidth: width} = contentRef.current;
			setSize({
				height,
				width
			});
			setInitialSize({
				height,
				width
			});
		}
	}, [setSize, setInitialSize]);
export const useHandlers = ({
	currentPosition,
	currentRotation,
	currentSize,
	onDrag,
	onDragStart,
	onDragEnd,
	onResize,
	onResizeStart,
	onResizeEnd,
	onRotate,
	onRotateStart,
	onRotateEnd
}) => {
	const handleDrag = useHandler(onDrag, {currentPosition, currentRotation, currentSize});
	const handleDragStart = useHandler(onDragStart, {
		currentPosition,
		currentRotation,
		currentSize
	});
	const handleDragEnd = useHandler(onDragEnd, {
		currentPosition,
		currentRotation,
		currentSize
	});

	const handleResize = useHandler(onResize, {currentPosition, currentRotation, currentSize});
	const handleResizeStart = useHandler(onResizeStart, {
		currentPosition,
		currentRotation,
		currentSize
	});
	const handleResizeEnd = useHandler(onResizeEnd, {
		currentPosition,
		currentRotation,
		currentSize
	});

	const handleRotate = useHandler(onRotate, {currentPosition, currentRotation, currentSize});
	const handleRotateStart = useHandler(onRotateStart, {
		currentPosition,
		currentRotation,
		currentSize
	});
	const handleRotateEnd = useHandler(onRotateEnd, {
		currentPosition,
		currentRotation,
		currentSize
	});

	return {
		handleDrag,
		handleDragEnd,
		handleDragStart,
		handleResize,
		handleResizeEnd,
		handleResizeStart,
		handleRotate,
		handleRotateEnd,
		handleRotateStart
	};
};