import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
// import { GLTF } from "three-stdlib";
// import * as THREE from "three";
import "./AvatarGenerator.css";

// type GLTFResult = GLTF & {
//   nodes: Record<string, THREE.Mesh>;
//   materials: Record<string, THREE.Material>;
// };

// Basic 3D Avatar Model component
interface AvatarModelProps {
  modelPath: string;
  position: [number, number, number];
  scale: [number, number, number];
}

const AvatarModel: React.FC<AvatarModelProps> = ({
  modelPath,
  position,
  scale,
}) => {
  const { scene } = useGLTF(modelPath);

  return <primitive object={scene} position={position} scale={scale} />;
};

function AvatarGenerator() {
  const [avatarOptions, setAvatarOptions] = useState({
    model: "/model/default.glb", // You'll need to provide this model
    hairColor: "#000000",
    skinTone: "#F5D0A9",
    eyeColor: "#0000FF",
  });

  const handleOptionChange = (option: string, value: any) => {
    setAvatarOptions({
      ...avatarOptions,
      [option]: value,
    });
  };

  return (
    <div className="avatar-generator">
      <div className="avatar-canvas">
        <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <AvatarModel
            modelPath={avatarOptions.model}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
          />
          <OrbitControls />
        </Canvas>
      </div>

      <div className="avatar-controls">
        <h2>Customize Your Avatar</h2>

        <div className="control-group">
          <label>Hair Color</label>
          <input
            type="color"
            value={avatarOptions.hairColor}
            onChange={(e) => handleOptionChange("hairColor", e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Skin Tone</label>
          <input
            type="color"
            value={avatarOptions.skinTone}
            onChange={(e) => handleOptionChange("skinTone", e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Eye Color</label>
          <input
            type="color"
            value={avatarOptions.eyeColor}
            onChange={(e) => handleOptionChange("eyeColor", e.target.value)}
          />
        </div>

        <button className="download-btn">Download Avatar</button>
      </div>
    </div>
  );
}

export default AvatarGenerator;
