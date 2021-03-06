import * as THREE from "three";
import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  Text,
  OrbitControls,
  TrackballControls,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import randomWord from "random-words";
import Inter from "./Inter-Bold.woff";

const projectWords = [
  "sundial",
  "persona, wallets",
  "os concepts",
  "prototyping practice",
  "3d explorations",
  "wholeheartedly-written",
  "picsart",
];

function Word({ children, ...props }) {
  const color = new THREE.Color();
  // const fontProps = { fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
//   const fontFile = useLoader(FontLoader, "/new-york-medium.json");
// 
//   const config = useMemo(
//     () => ({
//       fontFile,
//       fontSize: 6,
//       letterSpacing: -0.05,
//       lineHeight: 1,
//       "material-toneMapped": false,
//     }),
//     [fontFile]
//   );

  const fontProps = {
    font: 'NewYork.ttf',
    fontSize: 6,
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  };

  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const over = (e) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);
  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered) document.body.style.cursor = "pointer";
    return () => (document.body.style.cursor = "auto");
  }, [hovered]);
  // Tie component to the render-loop
  useFrame(({ camera }) => {
    // Make text face the camera
    ref.current.quaternion.copy(camera.quaternion);
    // Animate font color
    ref.current.material.color.lerp(
      color.set(hovered ? "#fa2720" : "#000000"),
      0.1
    );
  });
  // return <Text ref={ref} onPointerOver={over} onPointerOut={out} {...props} {...fontProps} children={children} />
  return (
    <Text
      ref={ref}
      onPointerOver={over}
      onPointerOut={out}
      {...props}
      {...fontProps}
      children={children}
    />
  );
}

const cameraDistance = 100;

function Cloud({ radius = 20 }) {
  let count = projectWords.length;
  const scroll = useScroll();

  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count);

    for (let i = 0; i < count + 1; i++)
      // Taken from https://discourse.threejs.org/t/can-i-place-obects-on-a-sphere-surface-evenly/4773/6
      // for (let j = 0; j < count; j++)
      temp.push([
        new THREE.Vector3().setFromSpherical(
          spherical.set(radius, phiSpan * i, 0)
        ),
        projectWords[i],
      ]);
    return temp;
  }, [count, radius]);

  useFrame((state, delta) => {
    // const scrollOffset = scroll.offset * 0.8;
    const scrollOffset = scroll.offset * 1;

    state.camera.position.set(
      0,
      (Math.cos(scrollOffset * Math.PI / 1.2) * cameraDistance),
      // (Math.atan(offset * Math.PI) * 80) / 1.26,
      (Math.sin(scrollOffset * Math.PI / 1.2) * cameraDistance)
    );
    state.camera.lookAt(0, 0, 0);
    // console.log("Camera", state.camera.position);
  });

  return words.map(([pos, word], index) => (
    <Word key={index} position={pos} children={word} />
  ));
}

function App() {
  // const scroll = useScroll();

  return (
    // <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 80], fov: 80 }}>
    <Canvas dpr={[1, 2]} camera={{ position: [0, cameraDistance, 0], fov: 90, near: 0.1, far: 80 }}>
      <fog attach="fog" args={["#fafafa", 30, 45]} />
      <ScrollControls pages={3}>
        <group rotation={[0, 0, 0]}>
          <Cloud radius={70} />
        </group>
      </ScrollControls>
    </Canvas>
  );
}

export default App;
