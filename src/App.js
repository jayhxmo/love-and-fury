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
  "persona (wallets)",
  "os concepts",
  "prototyping practice",
  "3d explorations",
  "wholeheartedly-written",
  "picsart",
];

function Word({ children, ...props }) {
  const color = new THREE.Color();
  // const fontProps = { fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false }
  const fontFile = useLoader(FontLoader, "/new-york-medium.json");

  const config = useMemo(
    () => ({
      fontFile,
      fontSize: 6,
      letterSpacing: -0.05,
      lineHeight: 1,
      "material-toneMapped": false,
    }),
    [fontFile]
  );

  const fontProps = {
    font: fontFile,
    fontSize: 2.5,
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
      {...config}
      children={children}
    />
  );
}

function Cloud({ radius = 20 }) {
  let count = projectWords.length;
  const scroll = useScroll();

  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count * 2);
    const thetaSpan = (Math.PI * 2) / count;
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

  //   useFrame((state, delta) => {
  //     const offset = 1 - scroll.offset;
  //     // console.log('scroll', offset, scroll.offset);
  //
  //     // state.camera.position.set(
  //     //   0,
  //     //   Math.atan(scroll.offset * Math.PI * 2) * 50,
  //     //   80
  //     // );
  //     state.camera.lookAt(0, 0, 0);
  //   });

  useFrame((state, delta) => {
    const offset = 1 - scroll.offset;
    state.camera.position.set(
      0,
      (Math.cos(scroll.offset * Math.PI / 2) * 80),
      // (Math.atan(offset * Math.PI) * 80) / 1.26,
      (Math.sin(scroll.offset * Math.PI / 2) * 80)
    );
    state.camera.lookAt(0, 0, 0);
    console.log("Camera", state.camera.position);
  });

  return words.map(([pos, word], index) => (
    <Word key={index} position={pos} children={word} />
  ));
}

function App() {
  // const scroll = useScroll();

  return (
    // <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 80], fov: 80 }}>
    <Canvas dpr={[1, 2]} camera={{ position: [0, 80, 0], fov: 80 }}>
      <fog attach="fog" args={["#ffffff", 0, 70]} />
      <ScrollControls pages={3}>
        <group rotation={[0, 0, 0]}>
          <Cloud count={8} radius={50} />
        </group>
      </ScrollControls>
    </Canvas>
  );
}

export default App;
