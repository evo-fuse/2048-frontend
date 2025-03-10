import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Circle, Loader, OrbitControls, Stats, useGLTF } from '@react-three/drei';

export const AvatarGenerator: React.FC = () => {
  const gltf = useGLTF('/model/male.glb');
  return (
    <Suspense fallback={<Loader />}>
      <Canvas camera={{ position: [-0.5, 1, 2] }} shadows>
        <directionalLight
          position={[-1.3, 6.0, 4.4]}
          castShadow
          intensity={Math.PI * 1}
        />
        <primitive
          object={gltf.scene}
          position={[0, 1, 0]}
          children-0-castShadow
        />
        <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
          <meshStandardMaterial />
        </Circle>
        <OrbitControls target={[0, 1, 0]} />
        <axesHelper args={[5]} />
        <Stats />
      </Canvas>
    </Suspense>
  );
};
// https://readyplayerme.github.io/visage/male.glb