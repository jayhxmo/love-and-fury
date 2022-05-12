import * as THREE from "three";
import { forwardRef, useLayoutEffect, useRef, useMemo, useState } from "react";
import { extend, useLoader, useFrame } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import lerp from "lerp";
import "./CustomMaterial";

// import FontNewYork from "../new-york-regular.json";
// import FontNewYork from "../new-york-regular.json";
// import FontNewYork from "../new-york-regular.json";

const Text = forwardRef(
	(
		{
			children,
			vAlign = "center",
			hAlign = "center",
			size = 1,
			color = "#000000",
			primaryImage,
			secondaryImage,
			dispImage,
			...props
		},
		ref
	) => {
		extend({ TextGeometry });

		const font = useLoader(FontLoader, "/new-york-medium.json");
		const config = useMemo(
			() => ({ font, size: 40, height: 50, curveSegments: 24 }),
			[font]
		);

		const [texture, secondaryTexture, disp] = useLoader(
			THREE.TextureLoader,
			[primaryImage, secondaryImage, dispImage]
		);

		const mesh = useRef();
		const refMaterial = useRef();
		const [transformed, setTransformed] = useState(false);

		const onTransform = () => {
			console.log("Transforming");
			setTransformed(!transformed);
		};

		useLayoutEffect(() => {
			const size = new THREE.Vector3();
			mesh.current.geometry.computeBoundingBox();
			mesh.current.geometry.boundingBox.getSize(size);
			mesh.current.position.x =
				hAlign === "center"
					? -size.x / 2
					: hAlign === "right"
					? 0
					: -size.x;
			mesh.current.position.y =
				vAlign === "center"
					? -size.y / 2
					: vAlign === "top"
					? 0
					: -size.y;
		}, [children]);

		useFrame(
			() =>
				(refMaterial.current.dispFactor = lerp(
					refMaterial.current.dispFactor,
					transformed ? 1 : 0,
					0.1
				))
		);

		return (
			<group ref={ref} {...props} scale={[1, 1, 1]}>
				<mesh ref={mesh} onPointerDown={onTransform}>
					{/* <textGeometry args={[children, config]} /> */}
					<planeBufferGeometry attach="geometry" />
					{/* <meshNormalMaterial /> */}
					<customMaterial
						ref={refMaterial}
						attach="material"
						tex={texture}
						tex2={secondaryTexture}
						disp={disp}
					/>
				</mesh>
			</group>
		);
	}
);

export default Text;
